import React, { useState } from 'react'
import type { WorkoutPlan } from '../../../domain/entities/WorkoutPlan'
import type { Exercise } from '../../../domain/entities/Exercise'
import type { WorkoutDay } from '../../../domain/entities/WorkoutDay'
import { DayTabs } from './DayTabs'
import { DayEditor } from './DayEditor'
import { ProtocolCoverEditor } from './ProtocolCoverEditor'
import { Dumbbell, FileText } from 'lucide-react'

interface EditorViewProps {
  plan: WorkoutPlan
  viewMode?: 'split' | 'editor' | 'preview'
  onUpdateGeneral: <K extends keyof WorkoutPlan['general']>(
    field: K,
    value: WorkoutPlan['general'][K]
  ) => void
  onAddMobilityItem: (item: string) => void
  onRemoveMobilityItem: (index: number) => void
  onUpdateMobilityItem: (index: number, value: string) => void
  onAddActivationItem: (item: string) => void
  onRemoveActivationItem: (index: number) => void
  onUpdateActivationItem: (index: number, value: string) => void
  onAddDay: () => void
  onDuplicateDay: (dayId: string) => void
  onRemoveDay: (dayId: string) => void
  onMoveDay: (dayId: string, direction: 'left' | 'right') => void
  onUpdateDay: (dayId: string, updates: Partial<WorkoutDay>) => void
  onAddExercise: (dayId: string, initialData?: Partial<Exercise>) => void
  onUpdateExercise: (dayId: string, exerciseId: string, field: keyof Exercise, value: string) => void
  onRemoveExercise: (dayId: string, exerciseId: string) => void
  onMoveExercise: (dayId: string, index: number, direction: 'up' | 'down') => void
}

export const EditorView: React.FC<EditorViewProps> = ({
  plan,
  viewMode = 'split',
  onUpdateGeneral,
  onAddMobilityItem,
  onRemoveMobilityItem,
  onUpdateMobilityItem,
  onAddActivationItem,
  onRemoveActivationItem,
  onUpdateActivationItem,
  onAddDay,
  onDuplicateDay,
  onRemoveDay,
  onMoveDay,
  onUpdateDay,
  onAddExercise,
  onUpdateExercise,
  onRemoveExercise,
  onMoveExercise,
}) => {
  const [activeTab, setActiveTab] = useState<'cover' | 'workouts'>('workouts')
  const [selectedDayId, setSelectedDayId] = useState<string>(plan.days[0]?.id || '')

  const activeDay = plan.days.find((d) => d.id === selectedDayId) || plan.days[0]
  const activeDayIndex = plan.days.findIndex((d) => d.id === activeDay?.id)

  return (
    <div className="flex flex-col h-full bg-zinc-950 text-zinc-100 overflow-y-auto">
      {/* Top Trainer Banner */}
      <div className="p-3.5 sm:p-4 border-b border-zinc-800 bg-zinc-900/60 flex items-center justify-between flex-wrap gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center font-black text-slate-950 text-sm shadow-md"
            style={{ backgroundColor: plan.trainer.primaryColor }}
          >
            {plan.trainer.name ? plan.trainer.name.charAt(0).toUpperCase() : 'P'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-white text-sm">
                {plan.trainer.name || 'Seu Nome / Personal'}
              </span>
              <span
                className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full text-slate-950"
                style={{ backgroundColor: plan.trainer.primaryColor }}
              >
                Personal
              </span>
            </div>
            <span className="text-xs text-zinc-400">
              {plan.trainer.instagram || plan.trainer.phone || 'Configure seus dados e cores'}
            </span>
          </div>
        </div>
      </div>

      {/* Dedicated Section: Editor Navigation Tabs */}
      <div className="border-b border-zinc-800 bg-zinc-900/90 px-3 sm:px-6 pt-3 shrink-0">
        <div className="flex gap-2 overflow-x-auto pb-0 -mb-px">
          <button
            type="button"
            onClick={() => setActiveTab('workouts')}
            data-testid="tab-workouts"
            className={`px-4 py-2.5 text-xs sm:text-sm font-black rounded-t-xl transition flex items-center gap-2 shrink-0 border-t-2 ${
              activeTab === 'workouts'
                ? 'bg-zinc-800 text-white border-t-2 shadow'
                : 'text-zinc-400 hover:text-zinc-200 border-transparent'
            }`}
            style={activeTab === 'workouts' ? { borderTopColor: plan.trainer.primaryColor } : undefined}
          >
            <Dumbbell
              className="w-4 h-4 shrink-0"
              style={{ color: activeTab === 'workouts' ? plan.trainer.primaryColor : undefined }}
            />
            <span>Dias de Treino ({plan.days.length} páginas)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('cover')}
            data-testid="tab-cover"
            className={`px-4 py-2.5 text-xs sm:text-sm font-black rounded-t-xl transition flex items-center gap-2 shrink-0 border-t-2 ${
              activeTab === 'cover'
                ? 'bg-zinc-800 text-white border-t-2 shadow'
                : 'text-zinc-400 hover:text-zinc-200 border-transparent'
            }`}
            style={activeTab === 'cover' ? { borderTopColor: plan.trainer.primaryColor } : undefined}
          >
            <FileText
              className="w-4 h-4 shrink-0"
              style={{ color: activeTab === 'cover' ? plan.trainer.primaryColor : undefined }}
            />
            <span>Capa & Protocolo Geral (Página 1)</span>
          </button>
        </div>
      </div>

      {/* TAB CONTENT */}
      {activeTab === 'workouts' && (
        <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6 flex-1 min-w-0 max-w-full">
          <DayTabs
            days={plan.days}
            selectedDayId={activeDay?.id || ''}
            primaryColor={plan.trainer.primaryColor}
            onSelectDay={setSelectedDayId}
            onAddDay={onAddDay}
          />

          {activeDay && (
            <DayEditor
              day={activeDay}
              dayIndex={activeDayIndex >= 0 ? activeDayIndex : 0}
              totalDays={plan.days.length}
              primaryColor={plan.trainer.primaryColor}
              isFullEditor={viewMode === 'editor'}
              onMoveDay={(dir) => onMoveDay(activeDay.id, dir)}
              onUpdateDay={(updates) => onUpdateDay(activeDay.id, updates)}
              onDuplicateDay={() => onDuplicateDay(activeDay.id)}
              onRemoveDay={() => onRemoveDay(activeDay.id)}
              onAddExercise={(init) => onAddExercise(activeDay.id, init)}
              onUpdateExercise={(exId, field, val) => onUpdateExercise(activeDay.id, exId, field, val)}
              onRemoveExercise={(exId) => onRemoveExercise(activeDay.id, exId)}
              onMoveExercise={(idx, dir) => onMoveExercise(activeDay.id, idx, dir)}
            />
          )}
        </div>
      )}

      {activeTab === 'cover' && (
        <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6 flex-1 min-w-0 max-w-full">
          <ProtocolCoverEditor
            general={plan.general}
            primaryColor={plan.trainer.primaryColor}
            onUpdateGeneral={onUpdateGeneral}
            onAddMobilityItem={onAddMobilityItem}
            onRemoveMobilityItem={onRemoveMobilityItem}
            onUpdateMobilityItem={onUpdateMobilityItem}
            onAddActivationItem={onAddActivationItem}
            onRemoveActivationItem={onRemoveActivationItem}
            onUpdateActivationItem={onUpdateActivationItem}
          />
        </div>
      )}
    </div>
  )
}

