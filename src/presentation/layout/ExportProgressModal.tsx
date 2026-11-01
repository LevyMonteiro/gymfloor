import React, { useEffect } from 'react'
import type { ExportProgress } from '../../infrastructure/pdf/PdfExportService'
import { Loader2, CheckCircle2, FileText, X, AlertCircle } from 'lucide-react'

interface ExportProgressModalProps {
  progress: ExportProgress
  primaryColor: string
  onClose: () => void
}

export const ExportProgressModal: React.FC<ExportProgressModalProps> = ({
  progress,
  primaryColor,
  onClose,
}) => {
  if (!progress.loading) return null

  const isSuccess =
    progress.status === 'success' ||
    Boolean(progress.message?.toLowerCase().includes('concluído'))
  const isError = progress.status === 'error'

  // Auto-dismiss after 6 seconds on success if user doesn't manually click close
  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        onClose()
      }, 6000)
      return () => clearTimeout(timer)
    }
  }, [isSuccess, onClose])

  return (
    <div
      data-testid="export-progress-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in"
    >
      <div className="bg-zinc-900 border border-zinc-700 rounded-3xl p-6 max-w-sm w-full shadow-2xl flex flex-col items-center text-center space-y-4 relative">
        {/* Close Button on completion */}
        {(isSuccess || isError) && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
            title="Fechar"
            data-testid="btn-close-progress-modal"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transition-colors duration-300"
          style={{
            backgroundColor: isSuccess ? '#10b981' : isError ? '#ef4444' : primaryColor,
          }}
        >
          {isSuccess ? (
            <CheckCircle2 className="w-8 h-8 text-white animate-scale-in" />
          ) : isError ? (
            <AlertCircle className="w-8 h-8 text-white" />
          ) : (
            <Loader2 className="w-7 h-7 text-slate-950 animate-spin" />
          )}
        </div>

        <div>
          <h3 className="text-base font-black text-white">
            {isSuccess
              ? 'Download Concluído!'
              : isError
              ? 'Atenção ao Gerar PDF'
              : 'Gerando Arquivo PDF'}
          </h3>
          <p className="text-xs text-zinc-400 mt-1">
            {isSuccess
              ? 'O arquivo PDF foi gerado em alta definição e salvo no seu computador.'
              : progress.message || 'Processando páginas em alta resolução...'}
          </p>
        </div>

        {/* File summary details badge on success */}
        {isSuccess && (
          <div className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-3 flex items-center justify-between text-left">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-zinc-200 truncate">
                  {progress.fileName || 'Protocolo_Treino.pdf'}
                </p>
                <p className="text-[10px] text-emerald-400 font-medium">Disponível em Downloads</p>
              </div>
            </div>
            {progress.fileSizeMb && (
              <span className="text-[11px] font-mono font-bold bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded-md shrink-0">
                {progress.fileSizeMb}
              </span>
            )}
          </div>
        )}

        {/* Page progress bar while generating */}
        {progress.totalPages && progress.currentPage && !isSuccess && !isError && (
          <div className="w-full space-y-1.5">
            <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  backgroundColor: primaryColor,
                  width: `${Math.round((progress.currentPage / progress.totalPages) * 100)}%`,
                }}
              />
            </div>
            <span className="text-[11px] font-mono text-zinc-400">
              Página {progress.currentPage} de {progress.totalPages}
            </span>
          </div>
        )}

        {/* Action Button on success or error */}
        {isSuccess && (
          <button
            type="button"
            onClick={onClose}
            data-testid="btn-confirm-download"
            className="w-full py-2.5 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition shadow-lg shadow-emerald-500/20 active:scale-95"
          >
            Entendido, fechar
          </button>
        )}
      </div>
    </div>
  )
}

