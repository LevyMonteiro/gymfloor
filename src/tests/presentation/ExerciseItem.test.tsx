import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ExerciseItem } from '../../presentation/components/editor/ExerciseItem'
import type { Exercise } from '../../domain/entities/Exercise'

describe('ExerciseItem Component', () => {
  const sampleExercise: Exercise = {
    id: 'ex-1',
    name: 'Supino Inclinado com Halteres',
    series: '4x',
    reps: '10-12',
    rest: '90s',
    notes: 'Cadência controlada',
  }

  it('should render exercise details and observation notes below description', () => {
    render(
      <ExerciseItem
        exercise={sampleExercise}
        index={0}
        totalExercises={3}
        primaryColor="#c026d3"
        onUpdate={vi.fn()}
        onRemove={vi.fn()}
        onMoveUp={vi.fn()}
        onMoveDown={vi.fn()}
      />
    )

    expect(screen.getByDisplayValue('Supino Inclinado com Halteres')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Cadência controlada')).toBeInTheDocument()
    expect(screen.getByDisplayValue('4x')).toBeInTheDocument()
    expect(screen.getByDisplayValue('10-12')).toBeInTheDocument()
    expect(screen.getByDisplayValue('90s')).toBeInTheDocument()
  })

  it('should render exercise details and notes side-by-side when isFullEditor is true (editor mode)', () => {
    const onUpdate = vi.fn()
    render(
      <ExerciseItem
        exercise={sampleExercise}
        index={0}
        totalExercises={3}
        primaryColor="#c026d3"
        isFullEditor={true}
        onUpdate={onUpdate}
        onRemove={vi.fn()}
        onMoveUp={vi.fn()}
        onMoveDown={vi.fn()}
      />
    )

    expect(screen.getByDisplayValue('Supino Inclinado com Halteres')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Cadência controlada')).toBeInTheDocument()

    const nameInput = screen.getByDisplayValue('Supino Inclinado com Halteres')
    fireEvent.change(nameInput, { target: { value: 'Crucifixo Reto' } })
    expect(onUpdate).toHaveBeenCalledWith('name', 'Crucifixo Reto')

    const notesInput = screen.getByDisplayValue('Cadência controlada')
    fireEvent.change(notesInput, { target: { value: 'Pausa isométrica de 2s' } })
    expect(onUpdate).toHaveBeenCalledWith('notes', 'Pausa isométrica de 2s')
  })

  it('should disable moveUp button for the first exercise', () => {
    render(
      <ExerciseItem
        exercise={sampleExercise}
        index={0}
        totalExercises={3}
        primaryColor="#c026d3"
        onUpdate={vi.fn()}
        onRemove={vi.fn()}
        onMoveUp={vi.fn()}
        onMoveDown={vi.fn()}
      />
    )

    const upButton = screen.getByLabelText('Mover para cima')
    expect(upButton).toBeDisabled()
  })

  it('should call onRemove when delete button is clicked', () => {
    const onRemove = vi.fn()
    render(
      <ExerciseItem
        exercise={sampleExercise}
        index={0}
        totalExercises={3}
        primaryColor="#c026d3"
        onUpdate={vi.fn()}
        onRemove={onRemove}
        onMoveUp={vi.fn()}
        onMoveDown={vi.fn()}
      />
    )

    const removeButton = screen.getByLabelText('Remover exercício')
    fireEvent.click(removeButton)

    expect(onRemove).toHaveBeenCalledTimes(1)
  })

  it('should call onMoveUp and onMoveDown when clicked', () => {
    const onMoveUp = vi.fn()
    const onMoveDown = vi.fn()

    render(
      <ExerciseItem
        exercise={sampleExercise}
        index={1}
        totalExercises={3}
        primaryColor="#c026d3"
        onUpdate={vi.fn()}
        onRemove={vi.fn()}
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
      />
    )

    const upButton = screen.getByLabelText('Mover para cima')
    const downButton = screen.getByLabelText('Mover para baixo')

    expect(upButton).not.toBeDisabled()
    expect(downButton).not.toBeDisabled()

    fireEvent.click(upButton)
    expect(onMoveUp).toHaveBeenCalledTimes(1)

    fireEvent.click(downButton)
    expect(onMoveDown).toHaveBeenCalledTimes(1)
  })
})

