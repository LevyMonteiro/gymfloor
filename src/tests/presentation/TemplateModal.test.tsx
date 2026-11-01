import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { TemplateModal } from '../../presentation/components/templates/TemplateModal'
import { TrainerService } from '../../domain/services/TrainerService'

describe('TemplateModal Component', () => {
  const initialTrainer = TrainerService.getDefaultTrainer()

  it('should render the modal with trainer name input and color themes', () => {
    render(
      <TemplateModal
        isOpen={true}
        onClose={vi.fn()}
        currentTrainer={initialTrainer}
        onSelectTrainer={vi.fn()}
      />
    )

    expect(screen.getByTestId('template-modal')).toBeInTheDocument()
    expect(screen.getByTestId('input-trainer-name')).toBeInTheDocument()
    expect(screen.getByText('Paleta de Cores (6 Temas)')).toBeInTheDocument()
  })

  it('should change color theme without overwriting trainer personal name', () => {
    const onSelectTrainer = vi.fn()
    render(
      <TemplateModal
        isOpen={true}
        onClose={vi.fn()}
        currentTrainer={initialTrainer}
        onSelectTrainer={onSelectTrainer}
      />
    )

    // Type a custom name
    const nameInput = screen.getByTestId('input-trainer-name')
    fireEvent.change(nameInput, { target: { value: 'Professor Silva' } })

    // Switch to Colors tab and pick Laranja Sunset
    fireEvent.click(screen.getByTestId('tab-colors'))
    const orangeCard = screen.getByTestId('theme-card-sunset-orange')
    fireEvent.click(orangeCard)

    // Save
    fireEvent.click(screen.getByTestId('btn-save-trainer'))

    expect(onSelectTrainer).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Professor Silva',
        primaryColor: '#f97316',
        themePreset: 'sunset-orange',
      })
    )
  })

  it('should not render anything when isOpen is false', () => {
    const { container } = render(
      <TemplateModal
        isOpen={false}
        onClose={vi.fn()}
        currentTrainer={initialTrainer}
        onSelectTrainer={vi.fn()}
      />
    )

    expect(container.firstChild).toBeNull()
  })

  it('should allow filling student name and calling onSave', () => {
    const onSave = vi.fn()
    render(
      <TemplateModal
        isOpen={true}
        onClose={vi.fn()}
        currentTrainer={initialTrainer}
        initialStudentName=""
        onSelectTrainer={vi.fn()}
        onSave={onSave}
      />
    )

    const studentNameInput = screen.getByTestId('input-modal-student-name')
    fireEvent.change(studentNameInput, { target: { value: 'Lucas Oliveira' } })

    fireEvent.click(screen.getByTestId('btn-save-trainer'))

    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({
        studentName: 'Lucas Oliveira',
      })
    )
  })
})

