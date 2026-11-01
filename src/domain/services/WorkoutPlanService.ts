import type { WorkoutPlan, GeneralProtocol } from '../entities/WorkoutPlan'
import type { WorkoutDay } from '../entities/WorkoutDay'
import type { Exercise } from '../entities/Exercise'
import { createExercise } from '../entities/Exercise'
import { createWorkoutDay } from '../entities/WorkoutDay'
import { TrainerService } from './TrainerService'

export const DEFAULT_PLAN: WorkoutPlan = {
  id: 'plan-default-debora',
  createdAt: '2026-11-01T10:00:00.000Z',
  updatedAt: '2026-11-01T10:00:00.000Z',
  trainer: TrainerService.getDefaultTrainer(),
  general: {
    studentName: '',
    studentGoal: 'Hipertrofia & Definição Muscular',
    startDate: '01/11/2026',
    validity: '',
    split: 'Divisão ABCD',
    mobilityTitle: 'Alongamentos / Mobilidade',
    mobilityItems: [
      'Alongamentos 1, 2, 3, 8 e 9',
      '4, 5 e 7 (com step) Alongamento de Panturrilha No Espaldar',
    ],
    activationTitle: 'Ativação Central',
    activationItems: [
      'Prancha unilateral 30s cada lado',
      'Dead Bug alternado 2x15',
    ],
    notesTitle: 'Observações Gerais',
    notesText: 'Sexta-Feira Repetir o de Segunda.\nManter hidratação mínima de 35ml por kg ao longo do dia.',
  },
  days: [
    {
      id: 'day-a',
      letter: 'A',
      dayOfWeek: 'SEGUNDA-FEIRA',
      muscleGroup: 'Dorsal e Bíceps',
      cardioNotes: 'Cardio: 20 min pós-treino (esteira inclinada moderada)',
      exercises: [
        {
          id: 'ex-a-1',
          name: 'Remada Cavalinho hbl neutra',
          series: '4x',
          reps: '12-15',
          rest: '90s',
          notes: 'Foco no pico de contração dorsal',
        },
        {
          id: 'ex-a-2',
          name: 'Remada Unilateral c/ supinação polia alta sentado',
          series: '3x',
          reps: '10-12',
          rest: '60s',
          notes: 'Alongar bem na fase excêntrica',
        },
        {
          id: 'ex-a-3',
          name: 'Remada Neutra Pulley',
          series: '4x',
          reps: '12-15',
          rest: '60s',
          notes: 'Manter escápulas aduzidas',
        },
        {
          id: 'ex-a-4',
          name: 'Puxada Neutra Unilateral',
          series: '4x',
          reps: '10-12',
          rest: '90s',
          notes: 'Sem balanço do tronco',
        },
        {
          id: 'ex-a-5',
          name: 'Biceps neutro Cross + c/ supinação hbc',
          series: '4x',
          reps: '12-15',
          rest: '60s',
          notes: 'Super-série: realizar conjugado',
        },
      ],
    },
    {
      id: 'day-b',
      letter: 'B',
      dayOfWeek: 'TERÇA-FEIRA',
      muscleGroup: 'Inferiores - Quadríceps & Panturrilhas',
      cardioNotes: 'Alongamento leve e descompressão lombar ao final',
      exercises: [
        {
          id: 'ex-b-1',
          name: 'Passada 3x 15 ida e volta',
          series: '3x',
          reps: '15 passos',
          rest: '60s',
          notes: 'Tronco ligeiramente inclinado',
        },
        {
          id: 'ex-b-2',
          name: 'Agach. Squat',
          series: '4x',
          reps: '10-12',
          rest: '60s',
          notes: 'Amplitude total controlada',
        },
        {
          id: 'ex-b-3',
          name: 'Leg Horizontal',
          series: '4x',
          reps: '12-15',
          rest: '90s',
          notes: 'Pés na largura dos ombros',
        },
        {
          id: 'ex-b-4',
          name: 'Sumo Hbc',
          series: '4x',
          reps: '10-12',
          rest: '60s',
          notes: 'Segurando halter com step duplo',
        },
        {
          id: 'ex-b-5',
          name: 'Flexão Nórdica',
          series: '4x',
          reps: '12-15',
          rest: '60s',
          notes: 'Controle rigoroso da descida',
        },
        {
          id: 'ex-b-6',
          name: 'Panturrilha no step',
          series: '3x',
          reps: '12-15',
          rest: '40s',
          notes: 'Pausa de 2s no ponto mais alto',
        },
      ],
    },
    {
      id: 'day-c',
      letter: 'C',
      dayOfWeek: 'QUARTA-FEIRA',
      muscleGroup: 'Peitoral e Tríceps',
      cardioNotes: 'Cardio: 15 min de bike ou transport',
      exercises: [
        {
          id: 'ex-c-1',
          name: 'Supino Articulado',
          series: '4x',
          reps: '12-15',
          rest: '60s',
          notes: 'Progredir carga mantendo técnica',
        },
        {
          id: 'ex-c-2',
          name: 'Voador Peitoral',
          series: '4x',
          reps: '10-12',
          rest: '60s',
          notes: 'Abertura ampla sem estresse articular',
        },
        {
          id: 'ex-c-3',
          name: 'Crossover banco 30 polia média',
          series: '4x',
          reps: '12-15',
          rest: '60s',
          notes: 'Contração contínua',
        },
        {
          id: 'ex-c-4',
          name: 'Supino Banco 15 hbm',
          series: '4x',
          reps: '10-12',
          rest: '90s',
          notes: 'Descida em 3 segundos',
        },
        {
          id: 'ex-c-5',
          name: 'Triceps francês hbc + corda cross',
          series: '4x',
          reps: '12-15',
          rest: '60s',
          notes: 'Bi-set sem descanso entre os dois',
        },
      ],
    },
    {
      id: 'day-d',
      letter: 'D',
      dayOfWeek: 'QUINTA-FEIRA',
      muscleGroup: 'Glúteos, Posterior & Ombros',
      cardioNotes: 'Cardio: 20 min caminhada acelerada',
      exercises: [
        {
          id: 'ex-d-1',
          name: 'Abdutora 45 + 90',
          series: '4x',
          reps: '12-15',
          rest: '60s',
          notes: 'Variação de inclinação de tronco',
        },
        {
          id: 'ex-d-2',
          name: 'Elevação pélvica',
          series: '4x',
          reps: '10-12',
          rest: '60s',
          notes: 'Isometria de 2s no topo',
        },
        {
          id: 'ex-d-3',
          name: 'Recuo Unilateral',
          series: '4x',
          reps: '12-15',
          rest: '60s',
          notes: 'Cada perna consecutivamente',
        },
        {
          id: 'ex-d-4',
          name: 'Cadeira flexora',
          series: '4x',
          reps: '10-12',
          rest: '90s',
          notes: 'Cadência lenta na volta',
        },
        {
          id: 'ex-d-5',
          name: 'Abdução de ombro uni no cross',
          series: '3x',
          reps: '12-15',
          rest: '60s',
          notes: 'Linha paralela ao solo',
        },
        {
          id: 'ex-d-6',
          name: 'Dezenvol Hbc + Flexao de ombro no cross corda',
          series: '3x',
          reps: '10-12',
          rest: '60s',
          notes: 'Conjugado para deltoides',
        },
      ],
    },
  ],
}

export class WorkoutPlanService {
  static getDefaultPlan(): WorkoutPlan {
    return JSON.parse(JSON.stringify(DEFAULT_PLAN))
  }

  static addExercise(plan: WorkoutPlan, dayId: string, initialData?: Partial<Exercise>): WorkoutPlan {
    const newExercise = createExercise(initialData)
    return {
      ...plan,
      updatedAt: new Date().toISOString(),
      days: plan.days.map((day) =>
        day.id === dayId
          ? { ...day, exercises: [...day.exercises, newExercise] }
          : day
      ),
    }
  }

  static updateExercise(
    plan: WorkoutPlan,
    dayId: string,
    exerciseId: string,
    field: keyof Exercise,
    value: string
  ): WorkoutPlan {
    return {
      ...plan,
      updatedAt: new Date().toISOString(),
      days: plan.days.map((day) =>
        day.id === dayId
          ? {
              ...day,
              exercises: day.exercises.map((ex) =>
                ex.id === exerciseId ? { ...ex, [field]: value } : ex
              ),
            }
          : day
      ),
    }
  }

  static removeExercise(plan: WorkoutPlan, dayId: string, exerciseId: string): WorkoutPlan {
    return {
      ...plan,
      updatedAt: new Date().toISOString(),
      days: plan.days.map((day) =>
        day.id === dayId
          ? {
              ...day,
              exercises: day.exercises.filter((ex) => ex.id !== exerciseId),
            }
          : day
      ),
    }
  }

  static moveExercise(
    plan: WorkoutPlan,
    dayId: string,
    index: number,
    direction: 'up' | 'down'
  ): WorkoutPlan {
    const day = plan.days.find((d) => d.id === dayId)
    if (!day) return plan

    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= day.exercises.length) return plan

    const newExercises = [...day.exercises]
    const temp = newExercises[index]
    newExercises[index] = newExercises[targetIndex]
    newExercises[targetIndex] = temp

    return {
      ...plan,
      updatedAt: new Date().toISOString(),
      days: plan.days.map((d) => (d.id === dayId ? { ...d, exercises: newExercises } : d)),
    }
  }

  static addDay(plan: WorkoutPlan): WorkoutPlan {
    const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
    const nextLetter = letters[plan.days.length] || `D${plan.days.length + 1}`
    const newDay = createWorkoutDay(nextLetter)

    return {
      ...plan,
      updatedAt: new Date().toISOString(),
      days: [...plan.days, newDay],
    }
  }

  static duplicateDay(plan: WorkoutPlan, dayId: string): WorkoutPlan {
    const dayToCopy = plan.days.find((d) => d.id === dayId)
    if (!dayToCopy) return plan

    const newDay: WorkoutDay = {
      ...dayToCopy,
      id: `day-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      letter: `${dayToCopy.letter} (Cópia)`,
      exercises: dayToCopy.exercises.map((ex) => ({
        ...ex,
        id: `ex-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      })),
    }

    return {
      ...plan,
      updatedAt: new Date().toISOString(),
      days: [...plan.days, newDay],
    }
  }

  static removeDay(plan: WorkoutPlan, dayId: string): WorkoutPlan {
    if (plan.days.length <= 1) return plan
    return {
      ...plan,
      updatedAt: new Date().toISOString(),
      days: plan.days.filter((d) => d.id !== dayId),
    }
  }

  static moveDay(plan: WorkoutPlan, dayId: string, direction: 'left' | 'right'): WorkoutPlan {
    const currentIndex = plan.days.findIndex((d) => d.id === dayId)
    if (currentIndex === -1) return plan

    const targetIndex = direction === 'left' ? currentIndex - 1 : currentIndex + 1
    if (targetIndex < 0 || targetIndex >= plan.days.length) return plan

    const newDays = [...plan.days]
    const temp = newDays[currentIndex]
    newDays[currentIndex] = newDays[targetIndex]
    newDays[targetIndex] = temp

    return {
      ...plan,
      updatedAt: new Date().toISOString(),
      days: newDays,
    }
  }

  static updateDay(plan: WorkoutPlan, dayId: string, updates: Partial<WorkoutDay>): WorkoutPlan {
    return {
      ...plan,
      updatedAt: new Date().toISOString(),
      days: plan.days.map((d) => (d.id === dayId ? { ...d, ...updates } : d)),
    }
  }

  static updateGeneral<K extends keyof GeneralProtocol>(
    plan: WorkoutPlan,
    field: K,
    value: GeneralProtocol[K]
  ): WorkoutPlan {
    return {
      ...plan,
      updatedAt: new Date().toISOString(),
      general: {
        ...plan.general,
        [field]: value,
      },
    }
  }
}

