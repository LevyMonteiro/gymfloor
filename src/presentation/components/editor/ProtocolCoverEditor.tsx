import React from 'react'
import type { GeneralProtocol } from '../../../domain/entities/WorkoutPlan'
import { Plus, Trash2, Calendar } from 'lucide-react'

interface ProtocolCoverEditorProps {
  general: GeneralProtocol
  primaryColor: string
  onUpdateGeneral: <K extends keyof GeneralProtocol>(field: K, value: GeneralProtocol[K]) => void
  onAddMobilityItem: (item: string) => void
  onRemoveMobilityItem: (index: number) => void
  onUpdateMobilityItem: (index: number, value: string) => void
  onAddActivationItem: (item: string) => void
  onRemoveActivationItem: (index: number) => void
  onUpdateActivationItem: (index: number, value: string) => void
}

export const ProtocolCoverEditor: React.FC<ProtocolCoverEditorProps> = ({
  general,
  primaryColor,
  onUpdateGeneral,
  onAddMobilityItem,
  onRemoveMobilityItem,
  onUpdateMobilityItem,
  onAddActivationItem,
  onRemoveActivationItem,
  onUpdateActivationItem,
}) => {
  return (
    <div className="space-y-6" data-testid="protocol-cover-editor">
      {/* Student Info Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
        <h3 className="font-black text-white text-base flex items-center gap-2">
          <Calendar className="w-4 h-4" style={{ color: primaryColor }} />
          <span>Dados do Aluno & Planejamento</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
          <div>
            <label className="block text-xs font-bold text-zinc-400 mb-1">
              Nome do Aluno
            </label>
            <input
              type="text"
              value={general.studentName}
              onChange={(e) => onUpdateGeneral('studentName', e.target.value)}
              data-testid="input-student-name"
              className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2 text-white font-bold text-sm focus:outline-none focus:border-white"
              placeholder="Nome do Aluno"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-400 mb-1">
              Objetivo Principal
            </label>
            <input
              type="text"
              value={general.studentGoal}
              onChange={(e) => onUpdateGeneral('studentGoal', e.target.value)}
              data-testid="input-student-goal"
              className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2 text-white font-bold text-sm focus:outline-none focus:border-white"
              placeholder="ex: Hipertrofia & Definição"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-400 mb-1">
              Data de Início
            </label>
            <input
              type="text"
              value={general.startDate}
              onChange={(e) => onUpdateGeneral('startDate', e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2 text-white font-bold text-sm focus:outline-none focus:border-white"
              placeholder="ex: 01/11/2026"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-400 mb-1">
              Validade do Treino
            </label>
            <input
              type="text"
              value={general.validity}
              onChange={(e) => onUpdateGeneral('validity', e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2 text-white font-bold text-sm focus:outline-none focus:border-white"
              placeholder="ex: 8 Semanas (opcional)"
            />
          </div>
        </div>
      </div>

      {/* Card 1: Alongamentos / Mobilidade */}
      <div className="p-4 sm:p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex-1 min-w-0">
            <h3 className="font-black text-white text-base">
              Bloco 1: Alongamentos / Mobilidade
            </h3>
            <p className="text-xs text-zinc-400">
              Aparece no primeiro bloco em destaque na Capa do PDF.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onAddMobilityItem('Novo alongamento / mobilidade')}
            data-testid="add-mobility-btn"
            className="w-full sm:w-auto py-2 px-3.5 rounded-xl font-bold text-xs transition flex items-center justify-center gap-1.5 border hover:opacity-90 shrink-0"
            style={{
              color: primaryColor,
              backgroundColor: `${primaryColor}18`,
              borderColor: `${primaryColor}45`,
            }}
          >
            <Plus className="w-3.5 h-3.5" /> Adicionar Linha
          </button>
        </div>

        <div className="space-y-2">
          {general.mobilityItems.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                value={item}
                onChange={(e) => onUpdateMobilityItem(index, e.target.value)}
                className="flex-1 bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2 text-white text-sm font-medium focus:outline-none focus:border-white"
              />
              <button
                type="button"
                onClick={() => onRemoveMobilityItem(index)}
                aria-label={`Remover mobilidade ${index}`}
                className="p-2 text-zinc-500 hover:text-red-400 transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Card 2: Ativação Central */}
      <div className="p-4 sm:p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex-1 min-w-0">
            <h3 className="font-black text-white text-base">
              Bloco 2: Ativação Central / Core
            </h3>
            <p className="text-xs text-zinc-400">
              Segundo bloco em destaque na Capa do PDF.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onAddActivationItem('Nova ativação / exercício de core')}
            data-testid="add-activation-btn"
            className="w-full sm:w-auto py-2 px-3.5 rounded-xl font-bold text-xs transition flex items-center justify-center gap-1.5 border hover:opacity-90 shrink-0"
            style={{
              color: primaryColor,
              backgroundColor: `${primaryColor}18`,
              borderColor: `${primaryColor}45`,
            }}
          >
            <Plus className="w-3.5 h-3.5" /> Adicionar Linha
          </button>
        </div>

        <div className="space-y-2">
          {general.activationItems.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                value={item}
                onChange={(e) => onUpdateActivationItem(index, e.target.value)}
                className="flex-1 bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2 text-white text-sm font-medium focus:outline-none focus:border-white"
              />
              <button
                type="button"
                onClick={() => onRemoveActivationItem(index)}
                aria-label={`Remover ativação ${index}`}
                className="p-2 text-zinc-500 hover:text-red-400 transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Card 3: Observações Gerais */}
      <div className="p-4 sm:p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
        <h3 className="font-black text-white text-base">
          Bloco 3: Observações Gerais & Recomendações
        </h3>
        <textarea
          rows={4}
          value={general.notesText}
          onChange={(e) => onUpdateGeneral('notesText', e.target.value)}
          className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-3.5 text-white text-sm font-medium focus:outline-none focus:border-white"
          placeholder="ex: Sexta-Feira Repetir o de Segunda..."
        />
      </div>
    </div>
  )
}

