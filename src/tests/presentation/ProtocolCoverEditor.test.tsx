import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ProtocolCoverEditor } from '../../presentation/components/editor/ProtocolCoverEditor'
import { WorkoutPlanService } from '../../domain/services/WorkoutPlanService'

describe('ProtocolCoverEditor Component', () => {
  const plan = WorkoutPlanService.getDefaultPlan()
  const general = plan.general

  it('should render protocol cover sections and buttons', () => {
    render(
      <ProtocolCoverEditor
        general={general}
        primaryColor="#10b981"
        onUpdateGeneral={vi.fn()}
        onAddMobilityItem={vi.fn()}
        onRemoveMobilityItem={vi.fn()}
        onUpdateMobilityItem={vi.fn()}
        onAddActivationItem={vi.fn()}
        onRemoveActivationItem={vi.fn()}
        onUpdateActivationItem={vi.fn()}
      />
    )

    expect(screen.getByText('Dados do Aluno & Planejamento')).toBeInTheDocument()
    expect(screen.getByText('Bloco 1: Alongamentos / Mobilidade')).toBeInTheDocument()
    expect(screen.getByText('Bloco 2: Ativação Central / Core')).toBeInTheDocument()
    expect(screen.getByText('Bloco 3: Observações Gerais & Recomendações')).toBeInTheDocument()

    expect(screen.getByTestId('add-mobility-btn')).toBeInTheDocument()
    expect(screen.getByTestId('add-activation-btn')).toBeInTheDocument()
  })

  it('should trigger onAddMobilityItem and onAddActivationItem when buttons are clicked', () => {
    const onAddMobility = vi.fn()
    const onAddActivation = vi.fn()

    render(
      <ProtocolCoverEditor
        general={general}
        primaryColor="#10b981"
        onUpdateGeneral={vi.fn()}
        onAddMobilityItem={onAddMobility}
        onRemoveMobilityItem={vi.fn()}
        onUpdateMobilityItem={vi.fn()}
        onAddActivationItem={onAddActivation}
        onRemoveActivationItem={vi.fn()}
        onUpdateActivationItem={vi.fn()}
      />
    )

    fireEvent.click(screen.getByTestId('add-mobility-btn'))
    expect(onAddMobility).toHaveBeenCalledTimes(1)

    fireEvent.click(screen.getByTestId('add-activation-btn'))
    expect(onAddActivation).toHaveBeenCalledTimes(1)
  })
})

