import React, { useState } from 'react'
import type { TrainerTemplate, LogoType } from '../../../domain/entities/Trainer'
import { TrainerService } from '../../../domain/services/TrainerService'
import { LogoGraphic } from '../common/LogoGraphic'
import {
  X,
  Check,
  Upload,
  Palette,
  User,
  UserCheck,
  Phone,
  Sparkles,
  Sliders,
  Trash2,
} from 'lucide-react'

interface TemplateModalProps {
  isOpen: boolean
  onClose: () => void
  currentTrainer: TrainerTemplate
  initialStudentName?: string
  onSelectTrainer: (trainer: TrainerTemplate) => void
  onSave?: (data: {
    trainer: TrainerTemplate
    studentName: string
  }) => void
}

export const TemplateModal: React.FC<TemplateModalProps> = ({
  isOpen,
  onClose,
  currentTrainer,
  initialStudentName = '',
  onSelectTrainer,
  onSave,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'colors'>('profile')
  const [customTrainer, setCustomTrainer] = useState<TrainerTemplate>({ ...currentTrainer })
  const [studentName, setStudentName] = useState<string>(initialStudentName)

  if (!isOpen) return null

  const colorThemes = TrainerService.getColorThemes()

  // Apply a color theme WITHOUT overwriting personal info
  const handleSelectColorTheme = (themeId: string) => {
    const selectedTheme = colorThemes.find((t) => t.id === themeId)
    if (selectedTheme) {
      setCustomTrainer((prev) => TrainerService.applyColorTheme(prev, selectedTheme))
    }
  }

  const handleSave = () => {
    if (onSave) {
      onSave({
        trainer: customTrainer,
        studentName,
      })
    }
    onSelectTrainer(customTrainer)
    onClose()
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setCustomTrainer((prev) => ({
            ...prev,
            logoType: 'custom',
            customLogoUrl: uploadEvent.target?.result as string,
          }))
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveCustomLogo = () => {
    setCustomTrainer((prev) => ({
      ...prev,
      logoType: 'silhouette',
      customLogoUrl: undefined,
    }))
  }

  return (
    <div
      data-testid="template-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-4 overflow-y-auto"
    >
      <div className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[94dvh] sm:h-auto sm:max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-zinc-800 bg-zinc-950/70 shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div
              className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform shrink-0"
              style={{ backgroundColor: customTrainer.primaryColor }}
            >
              <Palette className="w-4 h-4 sm:w-5 sm:h-5 text-slate-950 font-black" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h2 className="text-base sm:text-xl font-black text-white truncate">Identidade Visual & Personal</h2>
                <span
                  className="text-[9px] sm:text-[10px] uppercase font-black px-2 py-0.5 rounded-full text-slate-950 shrink-0"
                  style={{ backgroundColor: customTrainer.primaryColor }}
                >
                  Configuração
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-zinc-400 mt-0.5 line-clamp-1 sm:line-clamp-none">
                Preencha seus dados profissionais e escolha a paleta de cores para seus treinos.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition shrink-0 ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Identity Banner Preview */}
        <div
          className="px-4 sm:px-6 py-2.5 sm:py-3 border-b border-zinc-800/80 flex items-center justify-between flex-wrap gap-2 text-xs shrink-0"
          style={{ backgroundColor: `${customTrainer.darkBg}ee` }}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <LogoGraphic
              type={customTrainer.logoType}
              customUrl={customTrainer.customLogoUrl}
              color={customTrainer.primaryColor}
              secondaryColor={customTrainer.secondaryColor}
              size={28}
              name={customTrainer.name}
            />
            <div className="min-w-0">
              <span className="font-black text-white block truncate">
                {customTrainer.name || 'Seu Nome / Marca'}
              </span>
              <span className="text-[11px] text-zinc-400 block truncate">
                {customTrainer.title || 'Personal Trainer'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span
              className="w-4 h-4 rounded-full border border-white/20 shadow"
              style={{ backgroundColor: customTrainer.primaryColor }}
              title="Cor principal"
            />
            <span
              className="w-4 h-4 rounded-full border border-white/20 shadow"
              style={{ backgroundColor: customTrainer.secondaryColor }}
              title="Cor secundária"
            />
            <span
              className="w-4 h-4 rounded-full border border-white/20 shadow"
              style={{ backgroundColor: customTrainer.darkBg }}
              title="Cor de fundo"
            />
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-zinc-800 bg-zinc-950/40 px-3 sm:px-6 pt-2 sm:pt-3 gap-2 sm:gap-4 shrink-0 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            data-testid="tab-profile"
            className={`pb-2.5 sm:pb-3 text-xs sm:text-sm font-black flex items-center gap-1.5 sm:gap-2 border-b-2 transition whitespace-nowrap shrink-0 ${
              activeTab === 'profile'
                ? 'text-white'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
            style={activeTab === 'profile' ? { borderBottomColor: customTrainer.primaryColor } : undefined}
          >
            <User
              className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0"
              style={{ color: activeTab === 'profile' ? customTrainer.primaryColor : undefined }}
            />
            <span>Dados do Personal & Logo</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('colors')}
            data-testid="tab-colors"
            className={`pb-2.5 sm:pb-3 text-xs sm:text-sm font-black flex items-center gap-1.5 sm:gap-2 border-b-2 transition whitespace-nowrap shrink-0 ${
              activeTab === 'colors'
                ? 'text-white'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
            style={activeTab === 'colors' ? { borderBottomColor: customTrainer.primaryColor } : undefined}
          >
            <Sparkles
              className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0"
              style={{ color: activeTab === 'colors' ? customTrainer.primaryColor : undefined }}
            />
            <span>Paleta de Cores ({colorThemes.length} Temas)</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 sm:space-y-6 flex-1 min-h-0">
          {activeTab === 'profile' && (
            <div className="space-y-5">
              {/* Student Info Card */}
              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4" style={{ color: customTrainer.primaryColor }} />
                  <label className="text-xs font-black uppercase tracking-wider text-zinc-300">
                    Dados do Aluno (Treino Atual)
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">
                    Nome do Aluno *
                  </label>
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    data-testid="input-modal-student-name"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white font-bold focus:outline-none focus:border-white placeholder-zinc-600"
                    placeholder="ex: Carlos Silva"
                  />
                </div>
              </div>

              {/* Quick Color Theme Selector on the Profile Tab */}
              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5" style={{ color: customTrainer.primaryColor }} />
                    <span>Escolha a Cor dos Treinos</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setActiveTab('colors')}
                    className="text-[11px] font-bold hover:underline"
                    style={{ color: customTrainer.primaryColor }}
                  >
                    Ver detalhes das cores →
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {colorThemes.map((theme) => {
                    const isSelected = customTrainer.primaryColor === theme.primaryColor
                    return (
                      <button
                        key={theme.id}
                        type="button"
                        onClick={() => handleSelectColorTheme(theme.id)}
                        className={`p-2 rounded-xl border flex items-center gap-2 transition text-left ${
                          isSelected
                            ? 'border-white bg-zinc-800 shadow-md ring-2 ring-white/20'
                            : 'border-zinc-800 bg-zinc-900/60 hover:border-zinc-700 hover:bg-zinc-850'
                        }`}
                      >
                        <span
                          className="w-4 h-4 rounded-full border border-white/20 shrink-0 shadow"
                          style={{ backgroundColor: theme.primaryColor }}
                        />
                        <span className="text-xs font-bold text-white truncate">
                          {theme.name}
                        </span>
                        {isSelected && (
                          <Check className="w-3 h-3 text-white ml-auto shrink-0" />
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Personal Details Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">
                    Nome do Personal Trainer *
                  </label>
                  <input
                    type="text"
                    value={customTrainer.name}
                    onChange={(e) =>
                      setCustomTrainer((prev) => ({ ...prev, name: e.target.value }))
                    }
                    data-testid="input-trainer-name"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white font-bold focus:outline-none focus:border-white placeholder-zinc-600"
                    placeholder="ex: Seu Nome Completo"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">
                    Título / CREF / Especialidade
                  </label>
                  <input
                    type="text"
                    value={customTrainer.title}
                    onChange={(e) =>
                      setCustomTrainer((prev) => ({ ...prev, title: e.target.value }))
                    }
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white font-medium focus:outline-none focus:border-white placeholder-zinc-600"
                    placeholder="ex: Personal Trainer - CREF 012345-G/SP"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">
                    WhatsApp / Telefone
                  </label>
                  <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2">
                    <Phone className="w-4 h-4 text-zinc-400" />
                    <input
                      type="text"
                      value={customTrainer.phone}
                      onChange={(e) =>
                        setCustomTrainer((prev) => ({ ...prev, phone: e.target.value }))
                      }
                      className="w-full bg-transparent text-white font-medium focus:outline-none text-sm placeholder-zinc-600"
                      placeholder="(11) 98765-4321"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">
                    Instagram
                  </label>
                  <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2">
                    <svg
                      className="w-4 h-4 text-zinc-400"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                    </svg>
                    <input
                      type="text"
                      value={customTrainer.instagram}
                      onChange={(e) =>
                        setCustomTrainer((prev) => ({ ...prev, instagram: e.target.value }))
                      }
                      className="w-full bg-transparent text-white font-medium focus:outline-none text-sm placeholder-zinc-600"
                      placeholder="@seu.personal"
                    />
                  </div>
                </div>
              </div>

              {/* Logo Selection & Custom Logo Upload */}
              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase tracking-wider text-zinc-300">
                    Ícone ou Logotipo do Treino
                  </h4>
                  {customTrainer.customLogoUrl && (
                    <button
                      type="button"
                      onClick={handleRemoveCustomLogo}
                      className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remover imagem personalizada
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap gap-2.5 items-center">
                  {(
                    [
                      { id: 'silhouette', label: 'Silhueta Fitness' },
                      { id: 'dumbbell', label: 'Halteres' },
                      { id: 'flame', label: 'Chama / Fogo' },
                      { id: 'shield', label: 'Escudo / Brasão' },
                    ] as const
                  ).map(({ id, label }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() =>
                        setCustomTrainer((prev) => ({
                          ...prev,
                          logoType: id as LogoType,
                          customLogoUrl: undefined,
                        }))
                      }
                      className={`px-3 py-2 rounded-xl flex items-center gap-2 border text-xs font-bold transition ${
                        customTrainer.logoType === id && !customTrainer.customLogoUrl
                          ? 'border-white bg-zinc-800 text-white shadow'
                          : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:text-white'
                      }`}
                    >
                      <LogoGraphic
                        type={id as LogoType}
                        color={customTrainer.primaryColor}
                        secondaryColor={customTrainer.secondaryColor}
                        size={20}
                      />
                      <span>{label}</span>
                    </button>
                  ))}

                  <label className="cursor-pointer px-3 py-2 rounded-xl flex items-center gap-2 border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white text-xs font-bold transition bg-zinc-900">
                    <Upload className="w-4 h-4" style={{ color: customTrainer.primaryColor }} />
                    <span>Upload Logo Próprio</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Motivational Footer Message */}
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">
                  Mensagem de Apoio / Rodapé do Treino
                </label>
                <textarea
                  rows={2}
                  value={customTrainer.message}
                  onChange={(e) =>
                    setCustomTrainer((prev) => ({ ...prev, message: e.target.value }))
                  }
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-white text-xs font-medium focus:outline-none focus:border-white placeholder-zinc-600"
                  placeholder="Qualquer dúvida ou ajuste em relação ao treino, entre em contato comigo..."
                />
              </div>
            </div>
          )}

          {activeTab === 'colors' && (
            <div className="space-y-6">
              {/* Color Themes Grid */}
              <div className="space-y-2">
                <h3 className="text-sm font-black text-white">
                  Selecione um Estilo de Cores Pré-definido
                </h3>
                <p className="text-xs text-zinc-400">
                  Os templates alteram exclusivamente o esquema de cores das páginas e do PDF, mantendo todos os seus dados intactos.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                {colorThemes.map((theme) => {
                  const isSelected = customTrainer.primaryColor === theme.primaryColor
                  return (
                    <div
                      key={theme.id}
                      onClick={() => handleSelectColorTheme(theme.id)}
                      data-testid={`theme-card-${theme.id}`}
                      className={`cursor-pointer p-4 rounded-2xl border-2 transition-all flex flex-col justify-between relative overflow-hidden select-none ${
                        isSelected
                          ? 'border-white bg-zinc-800 shadow-xl ring-2 ring-white/20'
                          : 'border-zinc-800 bg-zinc-950/60 hover:border-zinc-700 hover:bg-zinc-800/60'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-black text-white text-sm">{theme.name}</span>
                        {isSelected && (
                          <span className="flex items-center gap-1 text-[10px] font-black text-slate-950 bg-white px-2 py-0.5 rounded-full">
                            <Check className="w-3 h-3" /> Ativo
                          </span>
                        )}
                      </div>

                      {/* Swatches Banner */}
                      <div className="h-10 rounded-xl overflow-hidden flex border border-white/10 shadow-inner">
                        <div
                          className="flex-1"
                          style={{ backgroundColor: theme.primaryColor }}
                          title="Destaque Principal"
                        />
                        <div
                          className="w-1/3"
                          style={{ backgroundColor: theme.secondaryColor }}
                          title="Cor Secundária"
                        />
                        <div
                          className="w-1/3"
                          style={{ backgroundColor: theme.darkBg }}
                          title="Fundo da Página"
                        />
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Manual Color Pickers */}
              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4" style={{ color: customTrainer.primaryColor }} />
                  <h4 className="text-xs font-black uppercase tracking-wider text-zinc-300">
                    Ajuste Fino Manual das Cores
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-400 mb-1">
                      Cor Principal (Destaque)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={customTrainer.primaryColor}
                        onChange={(e) =>
                          setCustomTrainer((prev) => ({
                            ...prev,
                            primaryColor: e.target.value,
                            accentGlow: `${e.target.value}66`,
                          }))
                        }
                        className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                      />
                      <input
                        type="text"
                        value={customTrainer.primaryColor}
                        onChange={(e) =>
                          setCustomTrainer((prev) => ({
                            ...prev,
                            primaryColor: e.target.value,
                          }))
                        }
                        className="w-24 bg-zinc-900 border border-zinc-700 text-xs px-2 py-1 rounded text-white font-mono uppercase"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-zinc-400 mb-1">
                      Cor Secundária
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={customTrainer.secondaryColor}
                        onChange={(e) =>
                          setCustomTrainer((prev) => ({
                            ...prev,
                            secondaryColor: e.target.value,
                          }))
                        }
                        className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                      />
                      <input
                        type="text"
                        value={customTrainer.secondaryColor}
                        onChange={(e) =>
                          setCustomTrainer((prev) => ({
                            ...prev,
                            secondaryColor: e.target.value,
                          }))
                        }
                        className="w-24 bg-zinc-900 border border-zinc-700 text-xs px-2 py-1 rounded text-white font-mono uppercase"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-zinc-400 mb-1">
                      Fundo Escuro da Página
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={customTrainer.darkBg}
                        onChange={(e) =>
                          setCustomTrainer((prev) => ({
                            ...prev,
                            darkBg: e.target.value,
                          }))
                        }
                        className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                      />
                      <input
                        type="text"
                        value={customTrainer.darkBg}
                        onChange={(e) =>
                          setCustomTrainer((prev) => ({
                            ...prev,
                            darkBg: e.target.value,
                          }))
                        }
                        className="w-24 bg-zinc-900 border border-zinc-700 text-xs px-2 py-1 rounded text-white font-mono uppercase"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer: Pinned at bottom of modal */}
        <div className="p-3 sm:p-4 border-t border-zinc-800 bg-zinc-950/95 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-3 sm:px-4 py-2 rounded-xl text-zinc-400 hover:text-white font-bold text-xs sm:text-sm transition"
          >
            Fechar
          </button>

          <button
            type="button"
            onClick={handleSave}
            data-testid="btn-save-trainer"
            className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl font-black text-xs sm:text-sm text-slate-950 shadow-lg hover:opacity-95 transition flex items-center gap-1.5 sm:gap-2"
            style={{
              backgroundColor: customTrainer.primaryColor,
              boxShadow: `0 4px 15px ${customTrainer.accentGlow}`,
            }}
          >
            <Check className="w-4 h-4" />
            <span>Salvar e Aplicar</span>
          </button>
        </div>
      </div>
    </div>
  )
}
