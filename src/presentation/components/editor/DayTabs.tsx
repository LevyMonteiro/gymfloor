import React from 'react'
import type { WorkoutDay } from '../../../domain/entities/WorkoutDay'
import { Plus } from 'lucide-react'

interface DayTabsProps {
  days: WorkoutDay[]
  selectedDayId: string
  primaryColor: string
  onSelectDay: (dayId: string) => void
  onAddDay: () => void
}

export const DayTabs: React.FC<DayTabsProps> = ({
  days,
  selectedDayId,
  primaryColor,
  onSelectDay,
  onAddDay,
}) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-zinc-800 w-full min-w-0 max-w-full">
      {days.map((day) => {
        const isSelected = day.id === selectedDayId
        return (
          <button
            key={day.id}
            type="button"
            onClick={() => onSelectDay(day.id)}
            data-testid={`day-tab-${day.letter}`}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl font-black text-xs uppercase tracking-wider shrink-0 transition flex items-center gap-1.5 sm:gap-2 border ${
              isSelected
                ? 'bg-zinc-800 text-white shadow-lg'
                : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
            }`}
            style={isSelected ? { borderColor: primaryColor } : undefined}
          >
            <span
              className="w-5 h-5 rounded-md flex items-center justify-center text-[11px] font-black"
              style={{
                backgroundColor: isSelected ? primaryColor : '#3f3f46',
                color: isSelected ? '#000000' : '#ffffff',
              }}
            >
              {day.letter}
            </span>
            <span>{day.dayOfWeek}</span>
            <span className="text-[10px] text-zinc-400 font-mono">
              ({day.exercises.length} ex.)
            </span>
          </button>
        )
      })}

      <button
        type="button"
        onClick={onAddDay}
        data-testid="add-day-btn"
        className="px-3.5 py-2 rounded-xl font-black text-xs transition shrink-0 flex items-center gap-1.5 border hover:opacity-90"
        style={{
          color: primaryColor,
          backgroundColor: `${primaryColor}18`,
          borderColor: `${primaryColor}45`,
        }}
      >
        <Plus className="w-3.5 h-3.5" /> Adicionar Novo Dia
      </button>
    </div>
  )
}

