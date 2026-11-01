import type { WorkoutDay } from './WorkoutDay'
import type { TrainerTemplate } from './Trainer'

export interface GeneralProtocol {
  studentName: string
  studentGoal: string
  startDate: string
  validity: string
  split: string // e.g. "Divisão ABCD"
  mobilityTitle: string
  mobilityItems: string[]
  activationTitle: string
  activationItems: string[]
  notesTitle: string
  notesText: string
}

export interface WorkoutPlan {
  id: string
  createdAt: string
  updatedAt: string
  general: GeneralProtocol
  days: WorkoutDay[]
  trainer: TrainerTemplate
}

