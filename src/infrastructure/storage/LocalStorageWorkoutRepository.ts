import type { WorkoutPlan } from '../../domain/entities/WorkoutPlan'
import { WorkoutPlanService } from '../../domain/services/WorkoutPlanService'

const STORAGE_KEY = 'gymfloor_workout_plan_v4'

export class LocalStorageWorkoutRepository {
  static loadPlan(): WorkoutPlan {
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      if (data) {
        const parsed = JSON.parse(data)
        if (parsed && parsed.days && parsed.trainer) {
          // Ensure student name comes empty by default if it was legacy Levy Monteiro
          if (parsed.general && parsed.general.studentName === 'Levy Monteiro') {
            parsed.general.studentName = ''
          }
          // Ensure personal trainer name and instagram come empty by default
          if (
            !parsed.trainer.name ||
            parsed.trainer.name.toLowerCase().includes('débora') ||
            parsed.trainer.name.toLowerCase().includes('debora') ||
            parsed.trainer.name.toLowerCase().includes('personal')
          ) {
            parsed.trainer.name = ''
            parsed.trainer.instagram = ''
            parsed.trainer.phone = ''
          }
          return parsed
        }
      }
    } catch (err) {
      console.warn('Erro ao carregar treino do LocalStorage:', err)
    }
    return WorkoutPlanService.getDefaultPlan()
  }

  static savePlan(plan: WorkoutPlan): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(plan))
    } catch (err) {
      console.warn('Erro ao salvar treino no LocalStorage:', err)
    }
  }

  static clear(): void {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (err) {
      console.warn('Erro ao limpar LocalStorage:', err)
    }
  }
}

