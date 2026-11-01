import React from 'react'
import type { TrainerTemplate } from '../../domain/entities/Trainer'
import {
  Dumbbell,
  Edit3,
  Columns,
  Eye,
  Palette,
  RotateCcw,
  Download,
  Loader2,
  ArrowLeftRight,
} from 'lucide-react'

interface NavbarProps {
  studentName: string
  totalDays: number
  trainer: TrainerTemplate
  viewMode: 'split' | 'editor' | 'preview'
  isExporting: boolean
  onChangeViewMode: (mode: 'split' | 'editor' | 'preview') => void
  onOpenTemplates: () => void
  onReset: () => void
  onDownloadPdf: () => void
}

export const Navbar: React.FC<NavbarProps> = ({
  studentName,
  totalDays,
  trainer,
  viewMode,
  isExporting,
  onChangeViewMode,
  onOpenTemplates,
  onReset,
  onDownloadPdf,
}) => {
  return (
    <header className="h-16 border-b border-zinc-800 bg-zinc-900/90 backdrop-blur px-3 sm:px-4 flex items-center justify-between shrink-0 z-30 max-w-full overflow-hidden">
      {/* Brand Logo & Current Workout */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 shrink">
        <div
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg transition-transform hover:scale-105 shrink-0"
          style={{ backgroundColor: trainer.primaryColor }}
        >
          <Dumbbell className="w-4 h-4 sm:w-5 sm:h-5 text-slate-950 font-black" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-black text-base sm:text-lg tracking-wider text-white">
              GYM<span style={{ color: trainer.primaryColor }}>FLOOR</span>
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-zinc-400 truncate max-w-[100px] xs:max-w-[160px] sm:max-w-xs">
            Aluno: <span className="text-zinc-200 font-bold">{studentName || 'Novo Aluno'}</span> • {totalDays} dias
          </p>
        </div>
      </div>

      {/* View Mode Toggle Controls (Desktop) */}
      <div className="hidden md:flex items-center bg-zinc-950 p-1 rounded-2xl border border-zinc-800">
        <button
          type="button"
          onClick={() => onChangeViewMode('editor')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
            viewMode === 'editor'
              ? 'bg-zinc-800 text-white shadow'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Editor</span>
        </button>
        <button
          type="button"
          onClick={() => onChangeViewMode('split')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
            viewMode === 'split'
              ? 'bg-zinc-800 text-white shadow'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Columns className="w-3.5 h-3.5" />
          <span>Lado a Lado</span>
        </button>
        <button
          type="button"
          onClick={() => onChangeViewMode('preview')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
            viewMode === 'preview'
              ? 'bg-zinc-800 text-white shadow'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>PDF Final</span>
        </button>
      </div>

      {/* Action Buttons: View Toggle (Mobile), Template, Reset, Export */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {/* Mobile Reversal Toggle Button (Editor <-> PDF) */}
        <button
          type="button"
          onClick={() => onChangeViewMode(viewMode === 'preview' ? 'editor' : 'preview')}
          className="md:hidden p-2 rounded-xl text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 transition shrink-0 flex items-center justify-center"
          title={viewMode === 'preview' ? 'Voltar para o Editor' : 'Visualizar PDF Final'}
          aria-label="Alternar visualização"
        >
          <ArrowLeftRight className="w-4 h-4" style={{ color: trainer.primaryColor }} />
        </button>

        <button
          type="button"
          onClick={onOpenTemplates}
          className="p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-bold text-zinc-200 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 transition flex items-center gap-1.5 shrink-0"
          title="Escolher ou personalizar estilo do personal"
        >
          <Palette className="w-4 h-4" style={{ color: trainer.primaryColor }} />
          <span className="hidden md:inline">Personal & Estilo</span>
        </button>

        <button
          type="button"
          onClick={onReset}
          className="p-2 rounded-xl text-zinc-400 hover:text-white bg-zinc-850 hover:bg-zinc-800 border border-zinc-800 transition shrink-0"
          title="Restaurar dados de exemplo"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Direct Download Button (Icon only on mobile, Icon + text on desktop) */}
        <button
          type="button"
          onClick={onDownloadPdf}
          disabled={isExporting}
          data-testid="btn-download-pdf"
          className="p-2 sm:px-4 sm:py-2 rounded-xl text-xs font-black text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition flex items-center gap-1.5 sm:gap-2 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transform active:scale-95 disabled:opacity-50 shrink-0 whitespace-nowrap"
          title="Baixar arquivo PDF direto com sangria total (sem bordas brancas)"
        >
          {isExporting ? (
            <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
          ) : (
            <Download className="w-4 h-4 text-slate-950" />
          )}
          <span className="hidden sm:inline">{isExporting ? 'Gerando...' : 'Baixar PDF'}</span>
        </button>
      </div>
    </header>
  )
}

