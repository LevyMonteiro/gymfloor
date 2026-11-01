import { describe, it, expect, beforeEach } from 'vitest'
import { LocalStorageWorkoutRepository } from '../../infrastructure/storage/LocalStorageWorkoutRepository'
import { WorkoutPlanService } from '../../domain/services/WorkoutPlanService'

describe('LocalStorageWorkoutRepository', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should return default plan when storage is empty', () => {
    const plan = LocalStorageWorkoutRepository.loadPlan()
    expect(plan.general.studentName).toBe('')
  })

  it('should save and load a modified plan', () => {
    const plan = WorkoutPlanService.getDefaultPlan()
    plan.general.studentName = 'Mariana Lima'

    LocalStorageWorkoutRepository.savePlan(plan)
    const loaded = LocalStorageWorkoutRepository.loadPlan()

    expect(loaded.general.studentName).toBe('Mariana Lima')
  })

  it('should return default plan if stored data is corrupted JSON', () => {
    localStorage.setItem('gymfloor_workout_plan_v4', 'invalid-json{{{')
    const loaded = LocalStorageWorkoutRepository.loadPlan()

    expect(loaded).toBeDefined()
    expect(loaded.general.studentName).toBe('')
  })
})

