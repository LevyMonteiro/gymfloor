import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { PdfDocument } from '../../presentation/components/pdf/PdfDocument'
import { WorkoutPlanService } from '../../domain/services/WorkoutPlanService'

describe('PdfDocument Component', () => {
  it('should render exactly 1 Cover page + 1 page per workout day (total 5 pages for ABCD)', () => {
    const plan = WorkoutPlanService.getDefaultPlan() // 4 days

    const { container } = render(
      <PdfDocument plan={plan} isForPrint={true} idPrefix="test" />
    )

    const pages = container.querySelectorAll('.print-page')
    expect(pages.length).toBe(5) // 1 Cover + 4 Days = Exactly 5 pages, NO 6th page!

    const pageWrappers = container.querySelectorAll('.page-wrapper')
    expect(pageWrappers.length).toBe(5)
  })

  it('should apply rounded-none and shadow-none when isForPrint is true (Full Bleed)', () => {
    const plan = WorkoutPlanService.getDefaultPlan()

    const { container } = render(
      <PdfDocument plan={plan} isForPrint={true} idPrefix="print-test" />
    )

    const pages = container.querySelectorAll('.print-page')
    pages.forEach((page) => {
      expect(page.className).toContain('rounded-none')
      expect(page.className).toContain('shadow-none')
    })
  })

  it('should render student name on both cover and daily workout pages', () => {
    const plan = WorkoutPlanService.getDefaultPlan()
    plan.general.studentName = 'Levy Monteiro'

    const { container } = render(
      <PdfDocument plan={plan} isForPrint={true} idPrefix="content-test" />
    )

    const textContent = container.textContent
    expect(textContent).toContain('Levy Monteiro')
    expect(textContent).toContain('PROTOCOLO DE TREINO')
    expect(textContent).toContain('TREINO A')
    expect(textContent).toContain('TREINO B')
    expect(textContent).toContain('TREINO C')
    expect(textContent).toContain('TREINO D')
  })
})

