import React from 'react'
import type { WorkoutDay } from '../../../domain/entities/WorkoutDay'
import type { WorkoutPlan } from '../../../domain/entities/WorkoutPlan'
import { LogoGraphic } from '../common/LogoGraphic'

interface PageWorkoutDayProps {
  plan: WorkoutPlan
  day: WorkoutDay
  pageIndex: number
  totalPages: number
  isForPrint?: boolean
}

export const PageWorkoutDay: React.FC<PageWorkoutDayProps> = ({
  plan,
  day,
  pageIndex,
  totalPages,
  isForPrint = false,
}) => {
  const { trainer, general } = plan

  return (
    <div
      className={`print-page relative ${
        isForPrint
          ? 'w-full h-full rounded-none shadow-none'
          : 'w-[210mm] min-w-[210mm] h-[297mm] max-h-[297mm] rounded-2xl shadow-2xl'
      } bg-slate-950 text-white flex flex-col justify-between overflow-hidden p-8 box-border select-none transition-all`}
      style={{
        backgroundColor: trainer.darkBg || '#090514',
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
        <div
          className="absolute -top-32 -right-32 w-[400px] h-[400px] rounded-full"
          style={{
            background: `radial-gradient(circle, ${trainer.primaryColor}55 0%, ${trainer.primaryColor}00 70%)`,
          }}
        />
        <div
          className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full"
          style={{
            background: `radial-gradient(circle, ${(trainer.secondaryColor || trainer.primaryColor)}55 0%, ${(trainer.secondaryColor || trainer.primaryColor)}00 70%)`,
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(${trainer.primaryColor} 1.5px, transparent 1.5px)`,
            backgroundSize: '24px 24px',
            opacity: 0.12,
          }}
        />
      </div>

      {/* Sparks Graphics */}
      <div className="absolute top-6 right-6 pointer-events-none opacity-50">
        <svg width="35" height="35" viewBox="0 0 40 40" fill={trainer.primaryColor}>
          <path d="M20 0 L24 15 L39 20 L24 25 L20 40 L16 25 L1 20 L16 15 Z" />
        </svg>
      </div>

      {/* TOP HEADER SECTION */}
      <div className="relative z-10 flex flex-col gap-3">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-3">
            <LogoGraphic
              type={trainer.logoType}
              customUrl={trainer.customLogoUrl}
              color={trainer.primaryColor}
              secondaryColor={trainer.secondaryColor || '#ffffff'}
              size={40}
              name={trainer.name}
            />
            <div>
              <div
                className="text-xs font-black tracking-widest uppercase"
                style={{ color: trainer.primaryColor }}
              >
                {trainer.name}
              </div>
              <div className="text-[10px] text-zinc-400 font-medium">
                {trainer.title || 'Consultoria Esportiva'}
              </div>
            </div>
          </div>

          <h1
            className="text-3xl font-black tracking-wide text-white uppercase text-right leading-none"
            style={{
              fontFamily: "'Bebas Neue', 'Impact', 'Arial Black', sans-serif",
              letterSpacing: '0.05em',
            }}
          >
            PROTOCOLO DE TREINO
          </h1>
        </div>

        {/* Student Name Pill */}
        <div className="bg-white text-slate-950 px-6 py-2.5 rounded-2xl shadow-md flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-zinc-500 font-extrabold text-xs uppercase tracking-wider">
              NOME:
            </span>
            <span className="text-slate-950 font-black text-lg tracking-tight">
              {general.studentName || 'Nome do Aluno'}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs font-bold text-zinc-600">
            {general.studentGoal && (
              <span className="inline-block bg-zinc-100 px-3 py-1 rounded-full text-zinc-700 font-semibold">
                {general.studentGoal}
              </span>
            )}
            <span
              className="px-3 py-1 rounded-full text-slate-950 font-black uppercase text-xs"
              style={{ backgroundColor: trainer.primaryColor }}
            >
              TREINO {day.letter || 'A'}
            </span>
          </div>
        </div>
      </div>

      {/* MAIN WORKOUT CARD (FULL PAGE DEDICATED TO THIS DAY) */}
      <div className="relative z-10 flex-1 my-4 flex flex-col bg-white rounded-3xl overflow-hidden shadow-2xl">
        {/* Workout Day Header Banner */}
        <div className="flex items-stretch border-b-2 border-zinc-100">
          <div
            className="w-20 py-2.5 px-2 flex flex-col items-center justify-center font-black text-slate-950 select-none uppercase shrink-0 text-center rounded-tl-3xl"
            style={{ backgroundColor: trainer.primaryColor }}
          >
            <span className="text-[10px] font-black tracking-widest text-slate-950/80 leading-tight uppercase">
              TREINO
            </span>
            <span
              className="text-3xl font-black text-slate-950 leading-none mt-1"
              style={{ fontFamily: "'Impact', 'Arial Black', sans-serif" }}
            >
              {day.letter || 'A'}
            </span>
          </div>

          <div className="flex-1 px-6 py-4 flex flex-col justify-center bg-slate-50/70">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-slate-950 tracking-wide uppercase">
                {day.dayOfWeek || 'SEGUNDA-FEIRA'}
              </h2>
              {day.muscleGroup && (
                <span
                  className="text-xs font-black uppercase px-3 py-1 rounded-full text-white tracking-wider"
                  style={{ backgroundColor: trainer.primaryColor }}
                >
                  {day.muscleGroup}
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-500 font-medium mt-0.5">
              Execute os movimentos priorizando a cadência e a amplitude correta.
            </p>
          </div>
        </div>

        {/* Exercises Table (Big, Readable, Clean Typography!) */}
        <div className="flex-1 p-6 flex flex-col justify-start overflow-hidden">
          {/* Table Header with explicit fixed column widths */}
          <div className="flex items-center px-3 pb-3 mb-2 border-b-2 border-zinc-200 text-xs font-black uppercase tracking-wider text-zinc-500">
            <div style={{ width: '52%', flexShrink: 0 }} className="flex items-center pl-1 text-left">
              Exercício
            </div>
            <div style={{ width: '16%', flexShrink: 0 }} className="flex items-center justify-center text-center">
              Séries
            </div>
            <div style={{ width: '16%', flexShrink: 0 }} className="flex items-center justify-center text-center">
              Repetições
            </div>
            <div style={{ width: '16%', flexShrink: 0 }} className="flex items-center justify-center text-center">
              Descanso
            </div>
          </div>

          {/* Table Rows with identical fixed column widths */}
          <div className="flex flex-col gap-2.5 flex-1 justify-start">
            {day.exercises.map((exercise, index) => (
              <div
                key={exercise.id}
                className="flex items-center px-3.5 py-3 rounded-xl bg-slate-50/80 hover:bg-slate-100/90 transition-colors border border-zinc-100 min-h-[58px]"
              >
                {/* Col 1: Exercise Name & Notes (52%) */}
                <div
                  style={{ width: '52%', flexShrink: 0 }}
                  className="flex items-center gap-3 pl-1 pr-3 overflow-hidden text-left"
                >
                  <span
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black text-slate-950 shrink-0 leading-none"
                    style={{ backgroundColor: trainer.primaryColor }}
                  >
                    {index + 1}
                  </span>
                  <div className="flex flex-col min-w-0">
                    <span className="text-base font-black text-slate-900 leading-snug">
                      {exercise.name}
                    </span>
                    {exercise.notes ? (
                      <span className="text-xs font-semibold text-zinc-500 mt-0.5 leading-normal">
                        {exercise.notes}
                      </span>
                    ) : null}
                  </div>
                </div>

                {/* Col 2: Series (16%) */}
                <div
                  style={{ width: '16%', flexShrink: 0 }}
                  className="flex items-center justify-center text-center"
                >
                  <span className="inline-flex items-center justify-center px-3 py-1 rounded-lg bg-zinc-200/70 font-black text-slate-900 text-sm leading-none">
                    {exercise.series || '4x'}
                  </span>
                </div>

                {/* Col 3: Repetitions (16%) */}
                <div
                  style={{ width: '16%', flexShrink: 0 }}
                  className="flex items-center justify-center text-center font-extrabold text-slate-900 text-sm leading-none"
                >
                  {exercise.reps || '10-12'}
                </div>

                {/* Col 4: Rest (16%) */}
                <div
                  style={{ width: '16%', flexShrink: 0 }}
                  className="flex items-center justify-center text-center"
                >
                  <span
                    className="inline-flex items-center justify-center px-2.5 py-1 rounded-lg text-xs font-black tracking-wide leading-none"
                    style={{
                      backgroundColor: `${trainer.primaryColor}22`,
                      color: trainer.primaryColor === '#ffffff' ? '#000000' : trainer.primaryColor,
                    }}
                  >
                    {exercise.rest || '60s'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Cardio / Extra Advice for the Day */}
          {day.cardioNotes && (
            <div className="mt-4 p-3.5 rounded-2xl bg-zinc-100 border border-zinc-200 flex items-center gap-3 text-slate-800">
              <span className="text-lg">🏃</span>
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-zinc-600 block">
                  Orientações do Dia & Cardio:
                </span>
                <span className="text-xs font-bold text-slate-900">
                  {day.cardioNotes}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* FOOTER */}
      <div className="relative z-10 flex items-center justify-between pt-2 border-t border-white/10 text-xs text-zinc-400">
        <div className="flex items-center gap-2">
          <span style={{ color: trainer.primaryColor }} className="font-black text-sm">✦</span>
          <span className="font-bold text-zinc-300">{trainer.name}</span>
          {trainer.instagram && <span className="text-zinc-500">• {trainer.instagram}</span>}
          {trainer.phone && <span className="text-zinc-500">• {trainer.phone}</span>}
        </div>

        <div className="font-mono text-[11px] text-zinc-500">
          Página {pageIndex} de {totalPages}
        </div>
      </div>
    </div>
  )
}

