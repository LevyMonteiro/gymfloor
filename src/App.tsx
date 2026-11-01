import React, { useState, useRef, useEffect } from 'react'
import { useWorkoutPlan } from './application/useWorkoutPlan'
import { usePdfExport } from './application/usePdfExport'
import { Logger } from './infrastructure/logger/Logger'
import { Navbar } from './presentation/layout/Navbar'
import { EditorView } from './presentation/components/editor/EditorView'
import { PdfDocument } from './presentation/components/pdf/PdfDocument'
import { TemplateModal } from './presentation/components/templates/TemplateModal'
import { ExportProgressModal } from './presentation/layout/ExportProgressModal'
import { FileCheck, ZoomIn, ZoomOut, Sparkles } from 'lucide-react'

export const App: React.FC = () => {
  const {
    plan,
    setTrainer,
    resetToDefault,
    updateGeneral,
    addMobilityItem,
    removeMobilityItem,
    updateMobilityItem,
    addActivationItem,
    removeActivationItem,
    updateActivationItem,
    addDay,
    duplicateDay,
    removeDay,
    moveDay,
    updateDay,
    addExercise,
    updateExercise,
    removeExercise,
    moveExercise,
  } = useWorkoutPlan()

  const { progress, handleDownload, dismissProgress } = usePdfExport()

  const [viewMode, setViewMode] = useState<'split' | 'editor' | 'preview'>(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      return 'editor'
    }
    return 'split'
  })
  const [zoom, setZoom] = useState<number>(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      return 0.4
    }
    return 0.7
  })
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(true)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const pdfContainerRef = useRef<HTMLDivElement>(null)

  const handleFitZoom = () => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
    setZoom(isMobile ? 0.4 : 0.7)
  }

  // Dynamically update text selection highlight to match chosen brand color
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.style.setProperty(
        '--selection-bg',
        plan.trainer.primaryColor || '#0284c7'
      )
    }
  }, [plan.trainer.primaryColor])

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  const onSelectTrainer = (trainer: typeof plan.trainer) => {
    setTrainer(trainer)
    showToast(`Identidade de "${trainer.name || 'Personal'}" aplicada com sucesso!`)
  }

  const onReset = () => {
    if (confirm('Deseja restaurar o treino padrão de exemplo?')) {
      resetToDefault()
      showToast('Treino de exemplo restaurado!')
    }
  }

  return (
    <>
      {/* 1. DEDICATED PRINT CONTAINER
          - Invisible on screen (@media screen { #print-root { display: none !important; } })
          - Visible when printing (@media print { #print-root { display: block !important; } })
          - Full Bleed: rounded-none shadow-none isForPrint=true
      */}
      <div id="print-root">
        <PdfDocument plan={plan} zoom={1} isForPrint={true} idPrefix="print" />
      </div>

      {/* 2. INTERACTIVE SCREEN UI */}
      <div
        id="screen-ui-root"
        className="no-print flex flex-col h-[100dvh] w-full max-w-full overflow-hidden bg-zinc-950 text-white font-sans"
      >
        <Navbar
          studentName={plan.general.studentName}
          totalDays={plan.days.length}
          trainer={plan.trainer}
          viewMode={viewMode}
          isExporting={progress.loading}
          onChangeViewMode={setViewMode}
          onOpenTemplates={() => setIsTemplateModalOpen(true)}
          onReset={onReset}
          onDownloadPdf={async () => {
            Logger.info('PDF_EXPORT', `Disparando download direto do PDF para "${plan.general.studentName}"...`)
            await handleDownload('print-root', plan.general.studentName)
          }}
        />

        {/* Workspace: Split or Single View */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* LEFT: EDITOR VIEW */}
          {(viewMode === 'editor' || viewMode === 'split') && (
            <div
              className={`flex flex-col h-full border-r border-zinc-800 transition-all ${
                viewMode === 'split' ? 'w-full md:w-1/2 lg:w-5/12' : 'w-full'
              }`}
            >
              <EditorView
                plan={plan}
                viewMode={viewMode}
                onUpdateGeneral={updateGeneral}
                onAddMobilityItem={addMobilityItem}
                onRemoveMobilityItem={removeMobilityItem}
                onUpdateMobilityItem={updateMobilityItem}
                onAddActivationItem={addActivationItem}
                onRemoveActivationItem={removeActivationItem}
                onUpdateActivationItem={updateActivationItem}
                onAddDay={addDay}
                onDuplicateDay={duplicateDay}
                onRemoveDay={removeDay}
                onMoveDay={moveDay}
                onUpdateDay={updateDay}
                onAddExercise={addExercise}
                onUpdateExercise={updateExercise}
                onRemoveExercise={removeExercise}
                onMoveExercise={moveExercise}
              />
            </div>
          )}

          {/* RIGHT: PREVIEW VIEW */}
          {(viewMode === 'preview' || viewMode === 'split') && (
            <div
              className={`flex-1 flex flex-col h-full bg-zinc-950/95 overflow-hidden ${
                viewMode === 'split' ? 'hidden md:flex' : 'flex'
              }`}
            >
              {/* Preview Toolbar */}
              <div className="h-12 border-b border-zinc-800 bg-zinc-900/40 px-4 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-black uppercase tracking-wider text-zinc-300">
                    Visualização ({1 + plan.days.length} Páginas A4)
                  </span>
                  <span className="text-[11px] text-zinc-500 hidden sm:inline">
                    • 1 página por dia de treino
                  </span>
                </div>

                {/* Zoom Controls */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setZoom((z) => Math.max(0.3, Number((z - 0.1).toFixed(1))))}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 transition"
                    title="Diminuir zoom"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs font-mono font-bold text-zinc-300 w-12 text-center">
                    {Math.round(zoom * 100)}%
                  </span>
                  <button
                    type="button"
                    onClick={() => setZoom((z) => Math.min(1.2, Number((z + 0.1).toFixed(1))))}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 transition"
                    title="Aumentar zoom"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleFitZoom}
                    data-testid="fit-zoom-btn"
                    className="px-2 py-1 rounded-lg text-[10px] font-bold text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 transition"
                  >
                    Ajustar
                  </button>
                </div>
              </div>

              {/* Scrollable Canvas */}
              <div className="flex-1 overflow-y-auto overflow-x-auto py-4 px-2 sm:px-4 md:p-8 flex justify-center items-start bg-zinc-900/30">
                <PdfDocument
                  plan={plan}
                  zoom={zoom}
                  containerRef={pdfContainerRef}
                  idPrefix="screen"
                  isForPrint={false}
                />
              </div>
            </div>
          )}
        </div>

        {/* TOAST NOTIFICATION */}
        {toastMessage && (
          <div
            className="fixed bottom-6 right-6 z-50 bg-zinc-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-fade-in border"
            style={{
              borderColor: plan.trainer.primaryColor,
              boxShadow: `0 10px 30px -10px ${plan.trainer.primaryColor}55`,
            }}
          >
            <Sparkles className="w-4 h-4" style={{ color: plan.trainer.primaryColor }} />
            <span className="text-xs font-bold">{toastMessage}</span>
          </div>
        )}

        {/* EXPORT PROGRESS OVERLAY */}
        <ExportProgressModal
          progress={progress}
          primaryColor={plan.trainer.primaryColor}
          onClose={dismissProgress}
        />

        {/* TEMPLATE PICKER & INITIAL SETUP MODAL */}
        <TemplateModal
          isOpen={isTemplateModalOpen}
          onClose={() => setIsTemplateModalOpen(false)}
          currentTrainer={plan.trainer}
          initialStudentName={plan.general.studentName}
          onSelectTrainer={onSelectTrainer}
          onSave={({ trainer, studentName }) => {
            setTrainer(trainer)
            updateGeneral('studentName', studentName)
            showToast('Dados e identidade aplicados com sucesso!')
          }}
        />
      </div>
    </>
  )
}

export default App
