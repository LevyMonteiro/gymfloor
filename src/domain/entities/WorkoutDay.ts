import type { Exercise } from './Exercise'
import { createExercise } from './Exercise'

export interface WorkoutDay {
  id: string
  letter: string // e.g. "A", "B", "C", "D"
  dayOfWeek: string // e.g. "SEGUNDA-FEIRA"
  muscleGroup: string // e.g. "Costas e Bíceps"
  exercises: Exercise[]
  cardioNotes?: string
}

export const createWorkoutDay = (letter: string, dayOfWeek?: string, muscleGroup?: string): WorkoutDay => ({
  id: `day-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
  letter,
  dayOfWeek: dayOfWeek || `TREINO ${letter}`,
  muscleGroup: muscleGroup || 'Grupamento Muscular',
  cardioNotes: 'Cardio: 20 min pós-treino',
  exercises: [createExercise()],
})
