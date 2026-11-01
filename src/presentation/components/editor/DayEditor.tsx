import React from 'react'
import type { WorkoutDay } from '../../../domain/entities/WorkoutDay'
import type { Exercise } from '../../../domain/entities/Exercise'
import { ExerciseItem } from './ExerciseItem'
import { Plus, Copy, Trash2, Info, ArrowLeft, ArrowRight } from 'lucide-react'

interface DayEditorProps {
  day: WorkoutDay
  dayIndex: number
  totalDays: number
  primaryColor: string
  isFullEditor?: boolean
  onMoveDay: (direction: 'left' | 'right') => void
  onUpdateDay: (updates: Partial<WorkoutDay>) => void
  onDuplicateDay: () => void
  onRemoveDay: () => void
  onAddExercise: (initialData?: Partial<Exercise>) => void
  onUpdateExercise: (exerciseId: string, field: keyof Exercise, value: string) => void
  onRemoveExercise: (exerciseId: string) => void
  onMoveExercise: (index: number, direction: 'up' | 'down') => void
}

const COMMON_EXERCISE_SUGGESTIONS = [
  'Supino Reto Barra / Halteres',
  'Supino Inclinado c/ Halteres',
  'Crossover Polia Média / Alta',
  'Voador Peitoral / Peck Deck',
  'Puxada Frontal Aberta',
  'Remada Baixa Polia',
  'Remada Cavalinho Neutra',
  'Remada Unilateral Serrote',
  'Agachamento Livre / Smith',
  'Leg Press 45',
  'Cadeira Extensora',
  'Mesa Flexora / Cadeira Flexora',
  'Stiff c/ Barra ou Halteres',
  'Elevação Pélvica',
  'Desenvolvimento com Halteres',
  'Elevação Lateral na Polia',
  'Rosca Direta / Scott',
  'Tríceps Corda / Testa',
  'Panturrilha no Step / Máquina',
]

export const DayEditor: React.FC<DayEditorProps> = ({
  day,
  dayIndex,
  totalDays,
  primaryColor,
  isFullEditor = false,
  onMoveDay,
  onUpdateDay,
  onDuplicateDay,
  onRemoveDay,
  onAddExercise,
  onUpdateExercise,
  onRemoveExercise,
  onMoveExercise,
}) => {
  return (
    <div className="space-y-6" data-testid={`day-editor-${day.id}`}>
      {/* Day Meta Header Form */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-zinc-900 border border-zinc-800 grid grid-cols-12 gap-2.5 sm:gap-3 items-center">
        <div className="col-span-3 sm:col-span-2 md:col-span-2">
          <label className="block text-[10px] sm:text-[11px] font-bold text-zinc-400 mb-1">
            Letra
          </label>
          <input
            type="text"
            value={day.letter}
            onChange={(e) => onUpdateDay({ letter: e.target.value.toUpperCase() })}
            data-testid="input-day-letter"
            className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-2 sm:px-3 py-2 text-white font-black text-center text-sm uppercase focus:outline-none focus:border-white"
            placeholder="A"
          />
        </div>

        <div className="col-span-9 sm:col-span-5 md:col-span-4">
          <label className="block text-[10px] sm:text-[11px] font-bold text-zinc-400 mb-1">
            Dia da Semana / Título
          </label>
          <input
            type="text"
            value={day.dayOfWeek}
            onChange={(e) => onUpdateDay({ dayOfWeek: e.target.value.toUpperCase() })}
            data-testid="input-day-of-week"
            className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-white font-black text-sm uppercase focus:outline-none focus:border-white"
            placeholder="SEGUNDA-FEIRA"
          />
        </div>

        <div className="col-span-12 sm:col-span-5 md:col-span-3">
          <label className="block text-[10px] sm:text-[11px] font-bold text-zinc-400 mb-1">
            Grupamento Muscular (Foco)
          </label>
          <input
            type="text"
            value={day.muscleGroup}
            onChange={(e) => onUpdateDay({ muscleGroup: e.target.value })}
            data-testid="input-muscle-group"
            className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-white font-bold text-sm focus:outline-none focus:border-white"
            placeholder="ex: Costas e Bíceps"
          />
        </div>

        <div className="col-span-12 md:col-span-3 flex items-center justify-between md:justify-end gap-1.5 pt-1 md:pt-5">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={dayIndex === 0}
              onClick={() => onMoveDay('left')}
              title="Mover treino para antes (esquerda)"
              aria-label="Mover treino para esquerda"
              className="p-2 rounded-xl text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 disabled:opacity-20 transition"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              disabled={dayIndex === totalDays - 1}
              onClick={() => onMoveDay('right')}
              title="Mover treino para depois (direita)"
              aria-label="Mover treino para direita"
              className="p-2 rounded-xl text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 disabled:opacity-20 transition"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onDuplicateDay}
              title="Duplicar este dia"
              aria-label="Duplicar dia"
              className="p-2 rounded-xl text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 transition"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
          <button
            type="button"
            onClick={onRemoveDay}
            title="Excluir este dia"
            aria-label="Excluir dia"
            className="p-2 rounded-xl text-red-400 hover:text-red-300 bg-red-950/40 hover:bg-red-900/60 border border-red-800/50 transition"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Cardio Notes (Full width across all screen sizes) */}
        <div className="col-span-12">
          <label className="block text-[11px] font-bold text-zinc-400 mb-1">
            Cardio & Observações Específicas do Dia
          </label>
          <input
            type="text"
            value={day.cardioNotes || ''}
            onChange={(e) => onUpdateDay({ cardioNotes: e.target.value })}
            className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-white text-xs font-medium focus:outline-none focus:border-white"
            placeholder="ex: 20 min de cardio pós-treino (esteira com inclinação)"
          />
        </div>
      </div>

      {/* EXERCISE LIST BUILDER */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex-1 min-w-0">
            <h3 className="font-black text-white text-base flex flex-wrap items-center gap-x-2 gap-y-0.5">
              <span>Exercícios do Treino {day.letter}</span>
              <span className="text-xs font-normal text-zinc-400">
                (Cada dia terá sua própria página A4 no PDF)
              </span>
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Adicione quantos exercícios precisar. No PDF final, eles aparecerão como texto profissional e legível.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onAddExercise()}
            data-testid="add-exercise-btn"
            className="w-full sm:w-auto px-4 py-2 rounded-xl font-bold text-xs text-slate-950 hover:opacity-95 shadow-md transition flex items-center justify-center gap-1.5 shrink-0"
            style={{
              backgroundColor: primaryColor,
              boxShadow: `0 2px 10px ${primaryColor}30`,
            }}
          >
            <Plus className="w-4 h-4" /> Adicionar Exercício
          </button>
        </div>

        {/* Exercise Rows */}
        <div className="space-y-2.5">
          {day.exercises.map((exercise, index) => (
            <ExerciseItem
              key={exercise.id}
              exercise={exercise}
              index={index}
              totalExercises={day.exercises.length}
              primaryColor={primaryColor}
              isFullEditor={isFullEditor}
              onUpdate={(field, val) => onUpdateExercise(exercise.id, field, val)}
              onRemove={() => onRemoveExercise(exercise.id)}
              onMoveUp={() => onMoveExercise(index, 'up')}
              onMoveDown={() => onMoveExercise(index, 'down')}
            />
          ))}
        </div>

        {/* Big Button to Add Next Exercise (as requested by user) */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => onAddExercise()}
            data-testid="release-next-exercise-btn"
            className="w-full px-4 sm:px-6 py-2.5 sm:py-3.5 border-2 border-dashed border-zinc-700 hover:border-zinc-500 bg-zinc-900/40 hover:bg-zinc-800/40 text-zinc-300 hover:text-white rounded-xl sm:rounded-2xl font-bold sm:font-black text-xs sm:text-sm transition flex items-center justify-center gap-2 group"
          >
            <Plus
              className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 group-hover:scale-110 transition-transform"
              style={{ color: primaryColor }}
            />
            <span>
              Liberar Próximo Exercício<span className="hidden sm:inline"> para Preenchimento</span>
            </span>
          </button>
        </div>

        {/* Suggestions Quick Chips */}
        <div className="pt-4 border-t border-zinc-800">
          <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 mb-2">
            <Info className="w-3.5 h-3.5 text-zinc-400" />
            <span>Sugestões rápidas de exercícios (clique para adicionar direto):</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {COMMON_EXERCISE_SUGGESTIONS.map((sug) => (
              <button
                key={sug}
                type="button"
                onClick={() => onAddExercise({ name: sug })}
                className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[11px] text-zinc-300 hover:text-white transition"
              >
                + {sug}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

