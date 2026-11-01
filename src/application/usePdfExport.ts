import { useState, useCallback } from 'react'
import {
  PdfExportService,
  type ExportProgress,
  type DownloadResult,
} from '../infrastructure/pdf/PdfExportService'

export function usePdfExport() {
  const [progress, setProgress] = useState<ExportProgress>({ loading: false })

  const handlePrint = useCallback((studentName: string) => {
    PdfExportService.print(studentName)
  }, [])

  const handleDownload = useCallback(
    async (
      sourceContainerId: string = 'print-root',
      studentName: string
    ): Promise<DownloadResult> => {
      return await PdfExportService.download(sourceContainerId, studentName, (p) => {
        setProgress(p)
      })
    },
    []
  )

  const dismissProgress = useCallback(() => {
    setProgress({ loading: false })
  }, [])

  return {
    progress,
    handlePrint,
    handleDownload,
    dismissProgress,
  }
}

