import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ExportProgressModal } from '../../presentation/layout/ExportProgressModal'

describe('ExportProgressModal', () => {
  it('should render nothing when loading is false', () => {
    const { container } = render(
      <ExportProgressModal
        progress={{ loading: false }}
        primaryColor="#10b981"
        onClose={vi.fn()}
      />
    )
    expect(container.firstChild).toBeNull()
  })

  it('should render generating state with page progress', () => {
    render(
      <ExportProgressModal
        progress={{
          loading: true,
          currentPage: 2,
          totalPages: 5,
          message: 'Processando página 2 de 5...',
        }}
        primaryColor="#10b981"
        onClose={vi.fn()}
      />
    )

    expect(screen.getByText('Gerando Arquivo PDF')).toBeInTheDocument()
    expect(screen.getByText('Processando página 2 de 5...')).toBeInTheDocument()
    expect(screen.getByText('Página 2 de 5')).toBeInTheDocument()
  })

  it('should render success state with filename, size, and close button', () => {
    const onCloseMock = vi.fn()
    render(
      <ExportProgressModal
        progress={{
          loading: true,
          status: 'success',
          fileName: 'Protocolo_Treino_Levy.pdf',
          fileSizeMb: '2.5 MB',
          message: 'Download concluído com sucesso!',
        }}
        primaryColor="#10b981"
        onClose={onCloseMock}
      />
    )

    expect(screen.getByText('Download Concluído!')).toBeInTheDocument()
    expect(screen.getByText('Protocolo_Treino_Levy.pdf')).toBeInTheDocument()
    expect(screen.getByText('2.5 MB')).toBeInTheDocument()
    expect(screen.getByText('Disponível em Downloads')).toBeInTheDocument()

    const confirmButton = screen.getByTestId('btn-confirm-download')
    expect(confirmButton).toBeInTheDocument()
    fireEvent.click(confirmButton)
    expect(onCloseMock).toHaveBeenCalledTimes(1)
  })
})

