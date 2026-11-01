import React from 'react'
import type { WorkoutPlan } from '../../../domain/entities/WorkoutPlan'
import { LogoGraphic } from '../common/LogoGraphic'

interface PageCoverProps {
  plan: WorkoutPlan
  totalPages: number
  isForPrint?: boolean
}

export const PageCover: React.FC<PageCoverProps> = ({
  plan,
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
      {/* Decorative Background Elements (Gradients without laggy blur filters) */}
      <div className="absolute inset-0 pointer-events-none opacity-25 overflow-hidden">
        {/* Soft radial glow circles using standard css gradients */}
        <div
          className="absolute -top-24 -left-24 w-[450px] h-[450px] rounded-full"
          style={{
            background: `radial-gradient(circle, ${trainer.primaryColor}55 0%, ${trainer.primaryColor}00 70%)`,
          }}
        />
        <div
          className="absolute -bottom-28 -right-28 w-[450px] h-[450px] rounded-full"
          style={{
            background: `radial-gradient(circle, ${(trainer.secondaryColor || trainer.primaryColor)}55 0%, ${(trainer.secondaryColor || trainer.primaryColor)}00 70%)`,
          }}
        />
        {/* Halftone dot pattern overlay */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(${trainer.primaryColor} 1.5px, transparent 1.5px)`,
            backgroundSize: '24px 24px',
            opacity: 0.15,
          }}
        />
      </div>

      {/* Background Graphic Accents (Sparks & Stars like in the reference) */}
      <div className="absolute top-10 right-10 pointer-events-none opacity-70">
        <svg width="60" height="60" viewBox="0 0 40 40" fill={trainer.primaryColor}>
          <path d="M20 0 L24 15 L39 20 L24 25 L20 40 L16 25 L1 20 L16 15 Z" />
        </svg>
      </div>
      <div className="absolute bottom-32 left-10 pointer-events-none opacity-50">
        <svg width="45" height="45" viewBox="0 0 40 40" fill={trainer.primaryColor}>
          <path d="M20 0 L24 15 L39 20 L24 25 L20 40 L16 25 L1 20 L16 15 Z" />
        </svg>
      </div>
      <div className="absolute top-1/3 left-6 pointer-events-none opacity-40">
        <svg width="25" height="25" viewBox="0 0 40 40" fill={trainer.primaryColor}>
          <path d="M20 0 L24 15 L39 20 L24 25 L20 40 L16 25 L1 20 L16 15 Z" />
        </svg>
      </div>

      {/* TOP HEADER */}
      <div className="relative z-10 flex flex-col items-center pt-2">
        {/* Sparkle badge */}
        <div className="flex items-center gap-2 mb-1">
          <span style={{ color: trainer.primaryColor }} className="text-xl">✦</span>
          <span className="text-xs uppercase tracking-widest text-zinc-400 font-semibold">
            {trainer.name} • {trainer.title || 'Consultoria Esportiva'}
          </span>
          <span style={{ color: trainer.primaryColor }} className="text-xl">✦</span>
        </div>

        {/* Big Bold PROTOCOLO DE TREINO Header */}
        <h1
          className="text-6xl font-black tracking-wider text-white uppercase text-center drop-shadow-md leading-none"
          style={{
            fontFamily: "'Bebas Neue', 'Impact', 'Arial Black', sans-serif",
            letterSpacing: '0.06em',
            textShadow: `0 0 20px ${trainer.accentGlow || 'rgba(6, 182, 212, 0.6)'}`,
          }}
        >
          PROTOCOLO DE TREINO
        </h1>

        {/* Student Info Pill */}
        <div className="mt-4 bg-white/95 text-slate-900 px-6 py-2 rounded-full shadow-lg flex items-center gap-4 text-sm font-semibold border border-white/20">
          <div className="flex items-center gap-1.5">
            <span className="text-zinc-600 font-bold uppercase text-xs">Aluno:</span>
            <span className="text-slate-950 font-black text-base">{general.studentName || 'Não Informado'}</span>
          </div>
          <span className="text-zinc-300">|</span>
          <div className="flex items-center gap-1.5">
            <span className="text-zinc-600 font-bold uppercase text-xs">Objetivo:</span>
            <span className="text-slate-950 font-bold">{general.studentGoal || 'Hipertrofia'}</span>
          </div>
          {general.validity && (
            <>
              <span className="text-zinc-300">|</span>
              <div className="flex items-center gap-1.5">
                <span className="text-zinc-600 font-bold uppercase text-xs">Validade:</span>
                <span className="text-slate-950 font-bold">{general.validity}</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* THREE CARDS (Faithful to the reference PDF) */}
      <div className="relative z-10 flex-1 flex flex-col justify-center gap-6 my-6 px-4">
        {/* Card 1: Alongamentos / Mobilidade */}
        <div className="w-full shadow-2xl rounded-2xl overflow-hidden border border-white/10">
          <div
            className="py-2.5 px-6 text-center font-black text-lg uppercase tracking-wide text-slate-950 transition-colors"
            style={{ backgroundColor: trainer.primaryColor }}
          >
            {general.mobilityTitle || 'Alongamentos / Mobilidade'}
          </div>
          <div className="bg-white text-slate-900 py-6 px-8 text-center flex flex-col justify-center items-center gap-1.5 min-h-[96px]">
            {general.mobilityItems && general.mobilityItems.length > 0 ? (
              general.mobilityItems.map((item, idx) => (
                <p key={idx} className="text-base font-bold leading-normal text-slate-800 text-center w-full">
                  {item}
                </p>
              ))
            ) : (
              <p className="text-slate-600 italic text-center w-full">Realizar aquecimento articular pré-treino.</p>
            )}
          </div>
        </div>

        {/* Card 2: Ativação Central */}
        <div className="w-full shadow-2xl rounded-2xl overflow-hidden border border-white/10">
          <div
            className="py-2.5 px-6 text-center font-black text-lg uppercase tracking-wide text-slate-950 transition-colors"
            style={{ backgroundColor: trainer.primaryColor }}
          >
            {general.activationTitle || 'Ativação Central'}
          </div>
          <div className="bg-white text-slate-900 py-6 px-8 text-center flex flex-col justify-center items-center gap-1.5 min-h-[96px]">
            {general.activationItems && general.activationItems.length > 0 ? (
              general.activationItems.map((item, idx) => (
                <p key={idx} className="text-base font-bold leading-normal text-slate-800 text-center w-full">
                  {item}
                </p>
              ))
            ) : (
              <p className="text-slate-600 italic text-center w-full">Prancha e ativação do core 3 séries.</p>
            )}
          </div>
        </div>

        {/* Card 3: Observações */}
        <div className="w-full shadow-2xl rounded-2xl overflow-hidden border border-white/10">
          <div
            className="py-2.5 px-6 text-center font-black text-lg uppercase tracking-wide text-slate-950 transition-colors"
            style={{ backgroundColor: trainer.primaryColor }}
          >
            {general.notesTitle || 'Observações'}
          </div>
          <div className="bg-white text-slate-900 py-6 px-8 text-center flex flex-col justify-center items-center min-h-[96px]">
            <p className="text-base font-bold leading-normal text-slate-800 whitespace-pre-line text-center w-full">
              {general.notesText || 'Seguir os intervalos de descanso prescritos com rigor.'}
            </p>
          </div>
        </div>
      </div>

      {/* BOTTOM FOOTER WITH PERSONAL BRANDING */}
      <div className="relative z-10 flex flex-col items-center pb-2 text-center">
        <div className="flex flex-col items-center justify-center mb-3">
          <LogoGraphic
            type={trainer.logoType}
            customUrl={trainer.customLogoUrl}
            color={trainer.primaryColor}
            secondaryColor={trainer.secondaryColor || '#ffffff'}
            size={70}
            name={trainer.name}
          />
          <h2
            className="text-lg font-black tracking-widest uppercase mt-1 drop-shadow"
            style={{ color: trainer.primaryColor }}
          >
            {trainer.name}
          </h2>
          <div className="flex items-center gap-3 text-xs text-zinc-400 mt-0.5">
            {trainer.instagram && <span>{trainer.instagram}</span>}
            {trainer.instagram && trainer.phone && <span>•</span>}
            {trainer.phone && <span>{trainer.phone}</span>}
          </div>
        </div>

        <p className="text-xs text-zinc-400 max-w-lg leading-relaxed px-4">
          {trainer.message ||
            'Qualquer dúvida, dificuldade ou necessidade de ajuste em relação ao treino, entre em contato comigo. Estou aqui para te apoiar no que for preciso!'}
        </p>

        <div className="mt-3 text-[10px] text-zinc-600 font-mono">
          Página 1 de {totalPages}
        </div>
      </div>
    </div>
  )
}

