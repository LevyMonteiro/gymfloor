import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Navbar } from '../../presentation/layout/Navbar'
import { TrainerService } from '../../domain/services/TrainerService'

describe('Navbar Component', () => {
  const trainer = TrainerService.getDefaultTrainer()

  it('should render brand and student info', () => {
    render(
      <Navbar
        studentName=""
        totalDays={4}
        trainer={trainer}
        viewMode="split"
        isExporting={false}
        onChangeViewMode={vi.fn()}
        onOpenTemplates={vi.fn()}
        onReset={vi.fn()}
        onDownloadPdf={vi.fn()}
      />
    )

    expect(screen.getByText('GYM')).toBeInTheDocument()
    expect(screen.getByText('FLOOR')).toBeInTheDocument()
    expect(screen.getByText('Novo Aluno')).toBeInTheDocument()
    expect(screen.getByText('Baixar PDF')).toBeInTheDocument()
  })

  it('should display custom student name when provided', () => {
    render(
      <Navbar
        studentName="Rodrigo Faro"
        totalDays={3}
        trainer={trainer}
        viewMode="split"
        isExporting={false}
        onChangeViewMode={vi.fn()}
        onOpenTemplates={vi.fn()}
        onReset={vi.fn()}
        onDownloadPdf={vi.fn()}
      />
    )

    expect(screen.getByText('Rodrigo Faro')).toBeInTheDocument()
  })

  it('should call onDownloadPdf when download button is clicked', () => {
    const onDownloadPdf = vi.fn()
    render(
      <Navbar
        studentName="Rodrigo Faro"
        totalDays={3}
        trainer={trainer}
        viewMode="split"
        isExporting={false}
        onChangeViewMode={vi.fn()}
        onOpenTemplates={vi.fn()}
        onReset={vi.fn()}
        onDownloadPdf={onDownloadPdf}
      />
    )

    const downloadBtn = screen.getByTestId('btn-download-pdf')
    fireEvent.click(downloadBtn)

    expect(onDownloadPdf).toHaveBeenCalledTimes(1)
  })
})

