import { describe, it, expect } from 'vitest'
import { TrainerService } from '../../domain/services/TrainerService'

describe('TrainerService', () => {
  it('should return all 6 color themes with unique IDs', () => {
    const themes = TrainerService.getColorThemes()
    expect(themes.length).toBe(6)

    const expectedNames = [
      'Magenta Neon',
      'Vermelho Crimson',
      'Ciano Elétrico',
      'Dourado Iron Gold',
      'Verde Esmeralda',
      'Laranja Sunset',
    ]

    const actualNames = themes.map((t) => t.name)
    expect(actualNames).toEqual(expectedNames)

    const ids = themes.map((t) => t.id)
    const uniqueIds = new Set(ids)
    expect(uniqueIds.size).toBe(6)
  })

  it('should have orange replacing the second blue', () => {
    const orangeTheme = TrainerService.getColorThemeById('sunset-orange')
    expect(orangeTheme).toBeDefined()
    expect(orangeTheme?.name).toBe('Laranja Sunset')
    expect(orangeTheme?.primaryColor).toBe('#f97316')
  })

  it('should apply color theme without overwriting trainer personal information', () => {
    const trainer = TrainerService.getDefaultTrainer()
    trainer.name = 'Carlos Personal'
    trainer.phone = '(11) 91234-5678'

    const orangeTheme = TrainerService.getColorThemeById('sunset-orange')!
    const updated = TrainerService.applyColorTheme(trainer, orangeTheme)

    expect(updated.name).toBe('Carlos Personal')
    expect(updated.phone).toBe('(11) 91234-5678')
    expect(updated.primaryColor).toBe('#f97316')
    expect(updated.themePreset).toBe('sunset-orange')
  })

  it('should update trainer and calculate accent glow color automatically', () => {
    const trainer = TrainerService.getDefaultTrainer()
    const updated = TrainerService.updateTrainer(trainer, {
      name: 'Novo Personal',
      primaryColor: '#ff0055',
    })

    expect(updated.name).toBe('Novo Personal')
    expect(updated.primaryColor).toBe('#ff0055')
    expect(updated.accentGlow).toBe('#ff005555')
  })
})
