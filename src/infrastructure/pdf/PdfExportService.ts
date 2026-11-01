import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { Logger } from '../logger/Logger'
import {
  sanitizeElementColors,
  installColorProxy,
  convertOklchToRgb,
  patchWindowGetComputedStyle,
} from './ColorSanitizer'

export interface ExportProgress {
  loading: boolean
  currentPage?: number
  totalPages?: number
  message?: string
  status?: 'processing' | 'compiling' | 'success' | 'error'
  fileName?: string
  fileSizeMb?: string
}

export interface DownloadResult {
  success: boolean
  fileName: string
  sizeBytes: number
  message: string
}

export class PdfExportService {
  /**
   * High-Definition Vector Print to PDF
   * Uses browser's native print engine with zero margins and full bleed.
   */
  static print(studentName: string): void {
    const originalTitle = document.title
    const safeName = (studentName || 'Aluno').replace(/[^a-zA-Z0-9_-]/g, '_')
    document.title = `Protocolo_Treino_${safeName}`

    setTimeout(() => {
      window.print()
      document.title = originalTitle
    }, 100)
  }

  /**
   * Internal PDF Document Renderer
   * Renders each page into jsPDF with 0mm margin (Full Bleed, Edge-to-Edge).
   */
  static async generatePdf(
    sourceContainerId: string = 'print-root',
    onProgress?: (progress: ExportProgress) => void
  ): Promise<jsPDF> {
    let tempSandbox: HTMLElement | null = null

    try {
      Logger.info('PDF_EXPORT', `Buscando contêiner #${sourceContainerId} no DOM...`)
      const source = document.getElementById(sourceContainerId)
      if (!source) {
        const errMsg = `Contêiner #${sourceContainerId} não encontrado no DOM.`
        Logger.error('PDF_EXPORT', errMsg)
        throw new Error(errMsg)
      }

      if (onProgress) {
        onProgress({
          loading: true,
          status: 'processing',
          message: 'Preparando páginas do documento...',
        })
      }

      // Create an exact off-screen render sandbox backed by dedicated CSS rules in index.css
      tempSandbox = source.cloneNode(true) as HTMLElement
      tempSandbox.id = 'temp-pdf-export-sandbox'

      // Ensure main window body/html have standard RGB and global getComputedStyle is patched
      patchWindowGetComputedStyle(window)
      if (typeof document !== 'undefined') {
        if (document.documentElement) document.documentElement.style.backgroundColor = '#09090b'
        if (document.body) document.body.style.backgroundColor = '#09090b'
      }

      document.body.appendChild(tempSandbox)

      // Normalize all modern Tailwind v4 OKLCH & OKLab colors to sRGB before html2canvas inspects styles
      sanitizeElementColors(tempSandbox)
      Logger.info('PDF_EXPORT', 'Cores OKLCH e OKLab normalizadas para RGB no sandbox.')

      // Ensure all web fonts are fully loaded before capturing
      if (typeof document !== 'undefined' && (document as any).fonts && (document as any).fonts.ready) {
        await (document as any).fonts.ready
      }
      // Let DOM settle and styles compute
      await new Promise((r) => setTimeout(r, 150))

      const clonedPages = Array.from(tempSandbox.querySelectorAll<HTMLElement>('.print-page'))
      const total = clonedPages.length
      Logger.info('PDF_EXPORT', `Contêiner clonado com sucesso no sandbox. ${total} página(s) encontradas.`)

      if (total === 0) {
        const errMsg = 'Nenhuma página (.print-page) encontrada para gerar o PDF.'
        Logger.error('PDF_EXPORT', errMsg)
        throw new Error(errMsg)
      }

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: false, // JPEGs already have DCT compression; avoids heavy JS thread freeze
      })

      for (let i = 0; i < total; i++) {
        const pageEl = clonedPages[i]

        if (onProgress) {
          onProgress({
            loading: true,
            status: 'processing',
            currentPage: i + 1,
            totalPages: total,
            message: `Processando página ${i + 1} de ${total}...`,
          })
        }

        Logger.info('PDF_EXPORT', `Iniciando captura da página ${i + 1}/${total} via html2canvas...`, {
          offsetWidth: pageEl.offsetWidth,
          offsetHeight: pageEl.offsetHeight,
        })

        // Yield to browser UI thread
        await new Promise((r) => setTimeout(r, 40))

        const canvas = await html2canvas(pageEl, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: convertOklchToRgb(pageEl.style.backgroundColor || '#090514'),
          width: 794,
          height: 1123,
          windowWidth: 794,
          windowHeight: 1123,
          scrollX: 0,
          scrollY: 0,
          x: 0,
          y: 0,
          onclone: async (clonedDoc, clonedEl) => {
            installColorProxy(clonedDoc)
            if (clonedDoc.head && typeof document !== 'undefined') {
              const headStyles = document.querySelectorAll('link[rel="stylesheet"], style')
              headStyles.forEach((styleTag) => {
                clonedDoc.head.appendChild(styleTag.cloneNode(true))
              })
            }
            // Transfer pre-loaded FontFace instances into the cloned iframe document
            if (typeof document !== 'undefined' && (document as any).fonts) {
              (document as any).fonts.forEach((fontFace: any) => {
                try {
                  clonedDoc.fonts.add(fontFace)
                } catch {
                  // Ignore if already added or restricted
                }
              })
            }
            // Fix Tailwind preflight breaking html2canvas FontMetrics baseline
            const fontMetricsFix = clonedDoc.createElement('style')
            fontMetricsFix.textContent = 'img { display: inline !important; vertical-align: baseline !important; }'
            clonedDoc.head.appendChild(fontMetricsFix)

            if (clonedDoc.fonts && clonedDoc.fonts.ready) {
              await clonedDoc.fonts.ready
            }
            if (clonedDoc.documentElement) clonedDoc.documentElement.style.backgroundColor = '#09090b'
            if (clonedDoc.body) clonedDoc.body.style.backgroundColor = '#09090b'
            if (clonedEl instanceof HTMLElement) {
              sanitizeElementColors(clonedEl)
            }
            await new Promise((r) => setTimeout(r, 60))
          },
        })

        Logger.info('PDF_EXPORT', `Página ${i + 1}/${total} capturada com sucesso (${canvas.width}x${canvas.height}px).`)

        // Lossless PNG encoding: preserves 100% of microdata, font clarity, and crisp lines (identical fidelity to 0.pdf)
        const imgData = canvas.toDataURL('image/png')

        if (i > 0) {
          pdf.addPage('a4', 'portrait')
        }

        pdf.addImage(imgData, 'PNG', 0, 0, 210, 297, undefined, 'FAST')

        // Release GPU canvas memory immediately to prevent browser memory freeze
        canvas.width = 0
        canvas.height = 0
      }

      Logger.success('PDF_EXPORT', `Todas as ${total} páginas foram renderizadas com sucesso no PDF!`)
      return pdf
    } catch (err) {
      Logger.error('PDF_EXPORT', 'Erro durante a renderização das páginas do PDF', err)
      throw err
    } finally {
      if (tempSandbox && tempSandbox.parentNode) {
        tempSandbox.parentNode.removeChild(tempSandbox)
      }
    }
  }

  /**
   * Direct 1-Click PDF Download
   * Builds the binary Blob completely in memory first, validates byte size,
   * triggers instant native anchor download (no 0kb lag), and displays persistent confirmation.
   */
  static async download(
    sourceContainerId: string = 'print-root',
    studentName: string,
    onProgress?: (progress: ExportProgress) => void
  ): Promise<DownloadResult> {
    try {
      Logger.info('PDF_EXPORT', `Iniciando processo de download do PDF para o aluno: "${studentName || 'Não Informado'}"...`)
      const pdf = await this.generatePdf(sourceContainerId, onProgress)

      if (onProgress) {
        onProgress({
          loading: true,
          status: 'compiling',
          message: 'Finalizando e compilando arquivo PDF...',
        })
      }

      await new Promise((r) => setTimeout(r, 60))

      const safeName = (studentName || 'Aluno').replace(/[^a-zA-Z0-9_-]/g, '_')
      const fileName = `Protocolo_Treino_${safeName}.pdf`

      Logger.info('PDF_EXPORT', 'Compilando ArrayBuffer plano e validando integridade de bytes...')
      const arrayBuffer = pdf.output('arraybuffer')
      if (!arrayBuffer || arrayBuffer.byteLength === 0) {
        throw new Error('Falha ao compilar o arquivo PDF: buffer de memória vazio.')
      }
      const pdfBlob = new Blob([arrayBuffer], { type: 'application/pdf' })

      Logger.info('PDF_EXPORT', `Buffer validado: ${pdfBlob.size} bytes. Disparando download nativo via Blob URL...`)
      const blobUrl = URL.createObjectURL(pdfBlob)
      const link = document.createElement('a')
      link.style.display = 'none'
      link.href = blobUrl
      link.download = fileName
      document.body.appendChild(link)
      link.click()

      // Give browser time to begin stream flush
      await new Promise((r) => setTimeout(r, 500))

      if (link.parentNode) {
        link.parentNode.removeChild(link)
      }
      setTimeout(() => URL.revokeObjectURL(blobUrl), 30000)

      const sizeMb = (pdfBlob.size / (1024 * 1024)).toFixed(1)
      Logger.success('PDF_EXPORT', `Download concluído com sucesso! Arquivo: ${fileName} (${sizeMb} MB).`)

      if (onProgress) {
        onProgress({
          loading: true,
          status: 'success',
          fileName,
          fileSizeMb: `${sizeMb} MB`,
          message: 'Download concluído com sucesso!',
        })
      }

      return {
        success: true,
        fileName,
        sizeBytes: pdfBlob.size,
        message: 'Download concluído com sucesso!',
      }
    } catch (err) {
      Logger.error('PDF_EXPORT', 'Falha no download direto do PDF! Acionando fallback para impressão nativa.', err)
      this.print(studentName)
      if (onProgress) {
        onProgress({
          loading: true,
          status: 'error',
          message: 'Falha no download direto, janela de impressão acionada.',
        })
      }
      return {
        success: false,
        fileName: 'Protocolo_Treino.pdf',
        sizeBytes: 0,
        message: 'Falha no download direto, janela de impressão acionada.',
      }
    }
  }
}
