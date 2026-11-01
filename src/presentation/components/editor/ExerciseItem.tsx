import React from 'react'
import type { Exercise } from '../../../domain/entities/Exercise'
import { ArrowUp, ArrowDown, Trash2 } from 'lucide-react'

interface ExerciseItemProps {
  exercise: Exercise
  index: number
  totalExercises: number
  primaryColor: string
  isFullEditor?: boolean
  onUpdate: (field: keyof Exercise, value: string) => void
  onRemove: () => void
  onMoveUp: () => void
  onMoveDown: () => void
}

export const ExerciseItem: React.FC<ExerciseItemProps> = ({
  exercise,
  index,
  totalExercises,
  primaryColor,
  isFullEditor = false,
  onUpdate,
  onRemove,
  onMoveUp,
  onMoveDown,
}) => {
  return (
    <div
      data-testid={`exercise-item-${exercise.id}`}
      className="p-3 sm:p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition flex flex-col md:flex-row items-stretch md:items-center gap-2.5 min-w-0 max-w-full"
    >
      {/* Top row on mobile (Index & Reorder on left, Delete on right). On desktop, md:contents makes them direct flex items */}
      <div className="flex items-center justify-between md:contents">
        {/* Index & Reorder Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 md:order-1">
          <span
            className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs text-slate-950 shadow shrink-0"
            style={{ backgroundColor: primaryColor }}
          >
            {index + 1}
          </span>
          <div className="flex items-center gap-1 sm:gap-1.5">
            <button
              type="button"
              disabled={index === 0}
              onClick={onMoveUp}
              aria-label="Mover para cima"
              title="Mover para cima"
              className="p-1.5 sm:p-2 rounded-xl text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 disabled:opacity-20 transition"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
            <button
              type="button"
              disabled={index === totalExercises - 1}
              onClick={onMoveDown}
              aria-label="Mover para baixo"
              title="Mover para baixo"
              className="p-1.5 sm:p-2 rounded-xl text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 disabled:opacity-20 transition"
            >
              <ArrowDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Delete button: On mobile sits right of Index. On desktop, sits at the end of the flex row */}
        <div className="shrink-0 flex items-center justify-end md:order-5">
          <button
            type="button"
            onClick={onRemove}
            aria-label="Remover exercício"
            className="p-1.5 sm:p-2 text-zinc-400 hover:text-red-400 hover:bg-zinc-800 transition rounded-xl"
            title="Remover exercício"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Series, Reps, Rest: 3-column grid on mobile, inline on desktop */}
      <div className="grid grid-cols-3 gap-2 md:flex md:items-center md:gap-2.5 shrink-0 md:order-2">
        {/* Series */}
        <div className="w-full md:w-20 shrink-0">
          <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-0.5 md:hidden">
            Séries
          </label>
          <input
            type="text"
            value={exercise.series}
            onChange={(e) => onUpdate('series', e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-2.5 py-2 text-white font-black text-center text-xs focus:outline-none focus:border-white placeholder-zinc-600"
            placeholder="Séries (4x)"
            title="Séries"
          />
        </div>

        {/* Reps */}
        <div className="w-full md:w-24 shrink-0">
          <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-0.5 md:hidden">
            Reps
          </label>
          <input
            type="text"
            value={exercise.reps}
            onChange={(e) => onUpdate('reps', e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-2.5 py-2 text-white font-bold text-center text-xs focus:outline-none focus:border-white placeholder-zinc-600"
            placeholder="Reps (12-15)"
            title="Repetições"
          />
        </div>

        {/* Rest */}
        <div className="w-full md:w-20 shrink-0">
          <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-0.5 md:hidden">
            Descanso
          </label>
          <input
            type="text"
            value={exercise.rest}
            onChange={(e) => onUpdate('rest', e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-2.5 py-2 text-white font-bold text-center text-xs focus:outline-none focus:border-white placeholder-zinc-600"
            placeholder="Descanso (60s)"
            title="Tempo de descanso"
          />
        </div>
      </div>

      {/* Main Exercise Description Input */}
      <div className="w-full md:flex-1 md:min-w-[200px] md:order-3">
        <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-0.5 md:hidden">
          Descrição do Exercício
        </label>
        <input
          type="text"
          value={exercise.name}
          onChange={(e) => onUpdate('name', e.target.value)}
          data-testid={`exercise-name-input-${index}`}
          className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2 text-white font-bold text-sm focus:outline-none focus:border-white placeholder-zinc-600"
          placeholder="Descrição do Exercício (ex: Remada Cavalinho hbl neutra)"
          title="Descrição do Exercício"
        />
      </div>

      {/* Observation / Instruction Input: Stacked below description on mobile, side-by-side on desktop */}
      <div className={`w-full md:flex-1 md:min-w-[180px] md:order-4 ${isFullEditor ? '' : 'md:hidden'}`}>
        <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-0.5 md:hidden">
          Observação / Instrução
        </label>
        <input
          type="text"
          value={exercise.notes || ''}
          onChange={(e) => onUpdate('notes', e.target.value)}
          data-testid={`exercise-notes-input-${index}`}
          className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2 text-zinc-300 font-medium text-xs focus:outline-none focus:border-white placeholder-zinc-600"
          placeholder="Observação (ex: Foco no pico de contração dorsal)"
          title="Observação que aparece abaixo do exercício no PDF"
        />
      </div>
    </div>
  )
}
