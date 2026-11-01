import { describe, it, expect } from 'vitest'
import { WorkoutPlanService } from '../../domain/services/WorkoutPlanService'

describe('WorkoutPlanService', () => {
  it('should generate a complete default workout plan', () => {
    const plan = WorkoutPlanService.getDefaultPlan()

    expect(plan.general.studentName).toBe('')
    expect(plan.general.validity).toBe('')
    expect(plan.trainer.primaryColor).toBe('#c026d3')
    expect(plan.days.length).toBe(4) // ABCD
    expect(plan.days[0].letter).toBe('A')
    expect(plan.days[0].exercises.length).toBeGreaterThan(0)
  })

  it('should add a new exercise to a specific day', () => {
    const plan = WorkoutPlanService.getDefaultPlan()
    const dayAId = plan.days[0].id
    const initialCount = plan.days[0].exercises.length

    const updatedPlan = WorkoutPlanService.addExercise(plan, dayAId, {
      name: 'Puxada Triângulo',
      series: '3x',
      reps: '10',
      rest: '45s',
    })

    const updatedDay = updatedPlan.days.find((d) => d.id === dayAId)
    expect(updatedDay?.exercises.length).toBe(initialCount + 1)
    const lastExercise = updatedDay?.exercises[updatedDay.exercises.length - 1]
    expect(lastExercise?.name).toBe('Puxada Triângulo')
    expect(lastExercise?.series).toBe('3x')
  })

  it('should update an existing exercise', () => {
    const plan = WorkoutPlanService.getDefaultPlan()
    const dayAId = plan.days[0].id
    const exerciseId = plan.days[0].exercises[0].id

    const updatedPlan = WorkoutPlanService.updateExercise(
      plan,
      dayAId,
      exerciseId,
      'name',
      'Remada Curvada com Barra'
    )

    const updatedExercise = updatedPlan.days[0].exercises.find((ex) => ex.id === exerciseId)
    expect(updatedExercise?.name).toBe('Remada Curvada com Barra')
  })

  it('should remove an exercise', () => {
    const plan = WorkoutPlanService.getDefaultPlan()
    const dayAId = plan.days[0].id
    const exerciseToRemoveId = plan.days[0].exercises[0].id
    const initialCount = plan.days[0].exercises.length

    const updatedPlan = WorkoutPlanService.removeExercise(plan, dayAId, exerciseToRemoveId)

    expect(updatedPlan.days[0].exercises.length).toBe(initialCount - 1)
    expect(updatedPlan.days[0].exercises.some((ex) => ex.id === exerciseToRemoveId)).toBe(false)
  })

  it('should reorder exercises (move up and down)', () => {
    const plan = WorkoutPlanService.getDefaultPlan()
    const dayAId = plan.days[0].id
    const firstExName = plan.days[0].exercises[0].name
    const secondExName = plan.days[0].exercises[1].name

    // Move first down
    const movedDown = WorkoutPlanService.moveExercise(plan, dayAId, 0, 'down')
    expect(movedDown.days[0].exercises[0].name).toBe(secondExName)
    expect(movedDown.days[0].exercises[1].name).toBe(firstExName)

    // Move back up
    const movedUp = WorkoutPlanService.moveExercise(movedDown, dayAId, 1, 'up')
    expect(movedUp.days[0].exercises[0].name).toBe(firstExName)
  })

  it('should add a new workout day (e.g. Day E)', () => {
    const plan = WorkoutPlanService.getDefaultPlan()
    const initialDaysCount = plan.days.length

    const updatedPlan = WorkoutPlanService.addDay(plan)

    expect(updatedPlan.days.length).toBe(initialDaysCount + 1)
    const newDay = updatedPlan.days[updatedPlan.days.length - 1]
    expect(newDay.letter).toBe('E')
    expect(newDay.exercises.length).toBe(1)
  })

  it('should duplicate a workout day with fresh exercise IDs', () => {
    const plan = WorkoutPlanService.getDefaultPlan()
    const dayA = plan.days[0]

    const updatedPlan = WorkoutPlanService.duplicateDay(plan, dayA.id)

    expect(updatedPlan.days.length).toBe(5)
    const clonedDay = updatedPlan.days[updatedPlan.days.length - 1]
    expect(clonedDay.letter).toContain('A (Cópia)')
    expect(clonedDay.exercises.length).toBe(dayA.exercises.length)
    expect(clonedDay.exercises[0].id).not.toBe(dayA.exercises[0].id)
  })

  it('should update general protocol fields', () => {
    const plan = WorkoutPlanService.getDefaultPlan()

    const updatedPlan = WorkoutPlanService.updateGeneral(plan, 'studentName', 'Carlos Souza')
    expect(updatedPlan.general.studentName).toBe('Carlos Souza')
  })

  it('should reorder workout days (e.g. move day B before day A)', () => {
    const plan = WorkoutPlanService.getDefaultPlan()
    const dayAId = plan.days[0].id
    const dayBId = plan.days[1].id

    expect(plan.days[0].id).toBe(dayAId)
    expect(plan.days[1].id).toBe(dayBId)

    // Move Day B to the left (before Day A)
    const movedPlan = WorkoutPlanService.moveDay(plan, dayBId, 'left')

    expect(movedPlan.days[0].id).toBe(dayBId)
    expect(movedPlan.days[1].id).toBe(dayAId)

    // Move Day B back to the right (after Day A)
    const movedBack = WorkoutPlanService.moveDay(movedPlan, dayBId, 'right')
    expect(movedBack.days[0].id).toBe(dayAId)
    expect(movedBack.days[1].id).toBe(dayBId)
  })
})

