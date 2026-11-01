import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { DayTabs } from '../../presentation/components/editor/DayTabs'
import { WorkoutPlanService } from '../../domain/services/WorkoutPlanService'

describe('DayTabs Component', () => {
  const plan = WorkoutPlanService.getDefaultPlan()

  it('should render all day tabs', () => {
    render(
      <DayTabs
        days={plan.days}
        selectedDayId={plan.days[0].id}
        primaryColor="#c026d3"
        onSelectDay={vi.fn()}
        onAddDay={vi.fn()}
      />
    )

    expect(screen.getByTestId('day-tab-A')).toBeInTheDocument()
    expect(screen.getByTestId('day-tab-B')).toBeInTheDocument()
    expect(screen.getByTestId('day-tab-C')).toBeInTheDocument()
    expect(screen.getByTestId('day-tab-D')).toBeInTheDocument()
  })

  it('should switch selected day on click', () => {
    const onSelectDay = vi.fn()
    render(
      <DayTabs
        days={plan.days}
        selectedDayId={plan.days[0].id}
        primaryColor="#c026d3"
        onSelectDay={onSelectDay}
        onAddDay={vi.fn()}
      />
    )

    fireEvent.click(screen.getByTestId('day-tab-B'))
    expect(onSelectDay).toHaveBeenCalledWith(plan.days[1].id)
  })

  it('should call onAddDay when add button is clicked', () => {
    const onAddDay = vi.fn()
    render(
      <DayTabs
        days={plan.days}
        selectedDayId={plan.days[0].id}
        primaryColor="#c026d3"
        onSelectDay={vi.fn()}
        onAddDay={onAddDay}
      />
    )

    fireEvent.click(screen.getByTestId('add-day-btn'))
    expect(onAddDay).toHaveBeenCalledTimes(1)
  })
})

