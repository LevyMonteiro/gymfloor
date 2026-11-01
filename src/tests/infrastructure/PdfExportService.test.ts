import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { PdfExportService } from '../../infrastructure/pdf/PdfExportService'

describe('PdfExportService', () => {
  describe('download flow', () => {
    beforeEach(() => {
      vi.restoreAllMocks()
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should compile full blob and return success with byte size', async () => {
      // Mock generatePdf
      const mockBlob = new Blob(['dummy pdf data content'], { type: 'application/pdf' })
      const mockPdf = {
        output: vi.fn().mockReturnValue(mockBlob),
      }
      vi.spyOn(PdfExportService, 'generatePdf').mockResolvedValue(mockPdf as any)

      // Mock URL.createObjectURL and link.click
      const createObjectURLMock = vi.fn().mockReturnValue('blob:http://localhost/dummy-pdf')
      const revokeObjectURLMock = vi.fn()
      global.URL.createObjectURL = createObjectURLMock
      global.URL.revokeObjectURL = revokeObjectURLMock

      const progressMessages: string[] = []
      const res = await PdfExportService.download('test-container', 'Levy Monteiro', (p) => {
        if (p.message) progressMessages.push(p.message)
      })

      expect(res.success).toBe(true)
      expect(res.fileName).toBe('Protocolo_Treino_Levy_Monteiro.pdf')
      expect(res.sizeBytes).toBe(mockBlob.size)
      expect(progressMessages).toContain('Finalizando e compilando arquivo PDF...')
      expect(progressMessages).toContain('Download concluído com sucesso!')
      expect(createObjectURLMock).toHaveBeenCalledWith(mockBlob)
    })
  })
})

