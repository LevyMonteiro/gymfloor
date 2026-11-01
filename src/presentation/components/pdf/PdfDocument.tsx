import React from 'react'
import type { WorkoutPlan } from '../../../domain/entities/WorkoutPlan'
import { PageCover } from './PageCover'
import { PageWorkoutDay } from './PageWorkoutDay'

interface PdfDocumentProps {
  plan: WorkoutPlan
  zoom?: number
  containerRef?: React.RefObject<HTMLDivElement | null>
  isForPrint?: boolean
  idPrefix?: string
}

export const PdfDocument: React.FC<PdfDocumentProps> = ({
  plan,
  zoom = 1,
  containerRef,
  isForPrint = false,
  idPrefix = 'screen',
}) => {
  const totalPages = 1 + plan.days.length

  if (isForPrint) {
    return (
      <div
        ref={containerRef}
        id={`${idPrefix}-pdf-document-root`}
        className="flex flex-col items-center gap-0 p-0 m-0"
      >
        {/* PAGE 1: COVER & GENERAL PROTOCOL */}
        <div id={`${idPrefix}-page-1`} className="page-wrapper">
          <PageCover plan={plan} totalPages={totalPages} isForPrint={true} />
        </div>

        {/* SUBSEQUENT PAGES: ONE FULL PAGE PER WORKOUT DAY (TREINO A, B, C...) */}
        {plan.days.map((day, idx) => (
          <div key={day.id} id={`${idPrefix}-page-${idx + 2}`} className="page-wrapper">
            <PageWorkoutDay
              plan={plan}
              day={day}
              pageIndex={idx + 2}
              totalPages={totalPages}
              isForPrint={true}
            />
          </div>
        ))}
      </div>
    )
  }

  // Base A4 dimensions in px at standard 96 DPI: 210mm = 794px, 297mm = 1123px.
  // gap-10 = 40px, pb-16 = 64px.
  const scaledWidth = Math.round(794 * zoom)
  const scaledHeight = Math.round((totalPages * 1123 + (totalPages - 1) * 40 + 64) * zoom)

  return (
    <div
      className="relative flex justify-center shrink-0"
      style={{
        width: `${scaledWidth}px`,
        height: `${scaledHeight}px`,
      }}
    >
      <div
        ref={containerRef}
        id={`${idPrefix}-pdf-document-root`}
        className="flex flex-col items-center gap-10 pb-16 absolute top-0 left-0"
        style={{
          width: '794px',
          transform: `scale(${zoom})`,
          transformOrigin: 'top left',
        }}
      >
        {/* PAGE 1: COVER & GENERAL PROTOCOL */}
        <div id={`${idPrefix}-page-1`} className="page-wrapper">
          <PageCover plan={plan} totalPages={totalPages} isForPrint={false} />
        </div>

        {/* SUBSEQUENT PAGES: ONE FULL PAGE PER WORKOUT DAY (TREINO A, B, C...) */}
        {plan.days.map((day, idx) => (
          <div key={day.id} id={`${idPrefix}-page-${idx + 2}`} className="page-wrapper">
            <PageWorkoutDay
              plan={plan}
              day={day}
              pageIndex={idx + 2}
              totalPages={totalPages}
              isForPrint={false}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

