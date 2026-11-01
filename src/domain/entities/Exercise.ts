export interface Exercise {
  id: string
  name: string
  series: string
  reps: string
  rest: string
  notes?: string
}

export const createExercise = (partial?: Partial<Exercise>): Exercise => ({
  id: partial?.id || `ex-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
  name: partial?.name || '',
  series: partial?.series || '4x',
  reps: partial?.reps || '10-12',
  rest: partial?.rest || '60s',
  notes: partial?.notes || '',
})

