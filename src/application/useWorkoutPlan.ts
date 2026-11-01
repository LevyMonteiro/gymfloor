import { useState, useEffect, useCallback } from 'react'
import type { WorkoutPlan, GeneralProtocol } from '../domain/entities/WorkoutPlan'
import type { WorkoutDay } from '../domain/entities/WorkoutDay'
import type { Exercise } from '../domain/entities/Exercise'
import type { TrainerTemplate } from '../domain/entities/Trainer'
import { WorkoutPlanService } from '../domain/services/WorkoutPlanService'
import { LocalStorageWorkoutRepository } from '../infrastructure/storage/LocalStorageWorkoutRepository'

export function useWorkoutPlan() {
  const [plan, setPlan] = useState<WorkoutPlan>(() =>
    LocalStorageWorkoutRepository.loadPlan()
  )

  // Persist whenever plan changes
  useEffect(() => {
    LocalStorageWorkoutRepository.savePlan(plan)
  }, [plan])

  const setTrainer = useCallback((trainer: TrainerTemplate) => {
    setPlan((prev) => ({
      ...prev,
      updatedAt: new Date().toISOString(),
      trainer,
    }))
  }, [])

  const resetToDefault = useCallback(() => {
    const defaultPlan = WorkoutPlanService.getDefaultPlan()
    setPlan(defaultPlan)
    LocalStorageWorkoutRepository.savePlan(defaultPlan)
  }, [])

  const updateGeneral = useCallback(
    <K extends keyof GeneralProtocol>(field: K, value: GeneralProtocol[K]) => {
      setPlan((prev) => WorkoutPlanService.updateGeneral(prev, field, value))
    },
    []
  )

  const addMobilityItem = useCallback((item: string) => {
    setPlan((prev) => ({
      ...prev,
      general: {
        ...prev.general,
        mobilityItems: [...prev.general.mobilityItems, item],
      },
    }))
  }, [])

  const removeMobilityItem = useCallback((index: number) => {
    setPlan((prev) => ({
      ...prev,
      general: {
        ...prev.general,
        mobilityItems: prev.general.mobilityItems.filter((_, i) => i !== index),
      },
    }))
  }, [])

  const updateMobilityItem = useCallback((index: number, value: string) => {
    setPlan((prev) => {
      const items = [...prev.general.mobilityItems]
      items[index] = value
      return {
        ...prev,
        general: { ...prev.general, mobilityItems: items },
      }
    });
  }, [])

  const addActivationItem = useCallback((item: string) => {
    setPlan((prev) => ({
      ...prev,
      general: {
        ...prev.general,
        activationItems: [...prev.general.activationItems, item],
      },
    }))
  }, [])

  const removeActivationItem = useCallback((index: number) => {
    setPlan((prev) => ({
      ...prev,
      general: {
        ...prev.general,
        activationItems: prev.general.activationItems.filter((_, i) => i !== index),
      },
    }))
  }, [])

  const updateActivationItem = useCallback((index: number, value: string) => {
    setPlan((prev) => {
      const items = [...prev.general.activationItems]
      items[index] = value
      return {
        ...prev,
        general: { ...prev.general, activationItems: items },
      }
    })
  }, [])

  const addDay = useCallback(() => {
    setPlan((prev) => WorkoutPlanService.addDay(prev))
  }, [])

  const duplicateDay = useCallback((dayId: string) => {
    setPlan((prev) => WorkoutPlanService.duplicateDay(prev, dayId))
  }, [])

  const removeDay = useCallback((dayId: string) => {
    setPlan((prev) => WorkoutPlanService.removeDay(prev, dayId))
  }, [])

  const moveDay = useCallback((dayId: string, direction: 'left' | 'right') => {
    setPlan((prev) => WorkoutPlanService.moveDay(prev, dayId, direction))
  }, [])

  const updateDay = useCallback((dayId: string, updates: Partial<WorkoutDay>) => {
    setPlan((prev) => WorkoutPlanService.updateDay(prev, dayId, updates))
  }, [])

  const addExercise = useCallback((dayId: string, initialData?: Partial<Exercise>) => {
    setPlan((prev) => WorkoutPlanService.addExercise(prev, dayId, initialData))
  }, [])

  const updateExercise = useCallback(
    (dayId: string, exerciseId: string, field: keyof Exercise, value: string) => {
      setPlan((prev) =>
        WorkoutPlanService.updateExercise(prev, dayId, exerciseId, field, value)
      )
    },
    []
  )

  const removeExercise = useCallback((dayId: string, exerciseId: string) => {
    setPlan((prev) => WorkoutPlanService.removeExercise(prev, dayId, exerciseId))
  }, [])

  const moveExercise = useCallback(
    (dayId: string, index: number, direction: 'up' | 'down') => {
      setPlan((prev) =>
        WorkoutPlanService.moveExercise(prev, dayId, index, direction)
      )
    },
    []
  )

  return {
    plan,
    setPlan,
    setTrainer,
    resetToDefault,
    updateGeneral,
    addMobilityItem,
    removeMobilityItem,
    updateMobilityItem,
    addActivationItem,
    removeActivationItem,
    updateActivationItem,
    addDay,
    duplicateDay,
    removeDay,
    moveDay,
    updateDay,
    addExercise,
    updateExercise,
    removeExercise,
    moveExercise,
  }
}

