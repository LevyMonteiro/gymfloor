import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { DayEditor } from '../../presentation/components/editor/DayEditor'
import { WorkoutPlanService } from '../../domain/services/WorkoutPlanService'

describe('DayEditor Component', () => {
  const plan = WorkoutPlanService.getDefaultPlan()
  const sampleDay = plan.days[1] // Day B

  it('should render day information and controls', () => {
    render(
      <DayEditor
        day={sampleDay}
        dayIndex={1}
        totalDays={4}
        primaryColor="#10b981"
        onMoveDay={vi.fn()}
        onUpdateDay={vi.fn()}
        onDuplicateDay={vi.fn()}
        onRemoveDay={vi.fn()}
        onAddExercise={vi.fn()}
        onUpdateExercise={vi.fn()}
        onRemoveExercise={vi.fn()}
        onMoveExercise={vi.fn()}
      />
    )

    expect(screen.getByDisplayValue('B')).toBeInTheDocument()
    expect(screen.getByDisplayValue(sampleDay.dayOfWeek)).toBeInTheDocument()
    expect(screen.getByTestId('add-exercise-btn')).toBeInTheDocument()
  })

  it('should call onMoveDay with left and right directions', () => {
    const onMoveDay = vi.fn()
    render(
      <DayEditor
        day={sampleDay}
        dayIndex={1}
        totalDays={4}
        primaryColor="#10b981"
        onMoveDay={onMoveDay}
        onUpdateDay={vi.fn()}
        onDuplicateDay={vi.fn()}
        onRemoveDay={vi.fn()}
        onAddExercise={vi.fn()}
        onUpdateExercise={vi.fn()}
        onRemoveExercise={vi.fn()}
        onMoveExercise={vi.fn()}
      />
    )

    const moveLeftBtn = screen.getByLabelText('Mover treino para esquerda')
    const moveRightBtn = screen.getByLabelText('Mover treino para direita')

    expect(moveLeftBtn).not.toBeDisabled()
    expect(moveRightBtn).not.toBeDisabled()

    fireEvent.click(moveLeftBtn)
    expect(onMoveDay).toHaveBeenCalledWith('left')

    fireEvent.click(moveRightBtn)
    expect(onMoveDay).toHaveBeenCalledWith('right')
  })

  it('should disable move left on first day and move right on last day', () => {
    const { rerender } = render(
      <DayEditor
        day={plan.days[0]}
        dayIndex={0}
        totalDays={4}
        primaryColor="#10b981"
        onMoveDay={vi.fn()}
        onUpdateDay={vi.fn()}
        onDuplicateDay={vi.fn()}
        onRemoveDay={vi.fn()}
        onAddExercise={vi.fn()}
        onUpdateExercise={vi.fn()}
        onRemoveExercise={vi.fn()}
        onMoveExercise={vi.fn()}
      />
    )

    expect(screen.getByLabelText('Mover treino para esquerda')).toBeDisabled()
    expect(screen.getByLabelText('Mover treino para direita')).not.toBeDisabled()

    rerender(
      <DayEditor
        day={plan.days[3]}
        dayIndex={3}
        totalDays={4}
        primaryColor="#10b981"
        onMoveDay={vi.fn()}
        onUpdateDay={vi.fn()}
        onDuplicateDay={vi.fn()}
        onRemoveDay={vi.fn()}
        onAddExercise={vi.fn()}
        onUpdateExercise={vi.fn()}
        onRemoveExercise={vi.fn()}
        onMoveExercise={vi.fn()}
      />
    )

    expect(screen.getByLabelText('Mover treino para esquerda')).not.toBeDisabled()
    expect(screen.getByLabelText('Mover treino para direita')).toBeDisabled()
  })

  it('should call onAddExercise when clicking release next exercise button', () => {
    const onAddExercise = vi.fn()
    render(
      <DayEditor
        day={plan.days[0]}
        dayIndex={0}
        totalDays={4}
        primaryColor="#10b981"
        onMoveDay={vi.fn()}
        onUpdateDay={vi.fn()}
        onDuplicateDay={vi.fn()}
        onRemoveDay={vi.fn()}
        onAddExercise={onAddExercise}
        onUpdateExercise={vi.fn()}
        onRemoveExercise={vi.fn()}
        onMoveExercise={vi.fn()}
      />
    )

    const releaseBtn = screen.getByTestId('release-next-exercise-btn')
    expect(releaseBtn).toBeInTheDocument()
    fireEvent.click(releaseBtn)
    expect(onAddExercise).toHaveBeenCalledTimes(1)
  })
})

