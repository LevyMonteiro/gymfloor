import type { TrainerTemplate, ColorTheme } from '../entities/Trainer'

export const COLOR_THEMES: ColorTheme[] = [
  {
    id: 'magenta-neon',
    name: 'Magenta Neon',
    primaryColor: '#c026d3', // vibrant fuchsia / magenta neon
    secondaryColor: '#9333ea', // purple
    darkBg: '#090514', // deep purple-black
    accentGlow: 'rgba(217, 38, 169, 0.45)',
  },
  {
    id: 'crimson-red',
    name: 'Vermelho Crimson',
    primaryColor: '#ef4444', // crimson power red
    secondaryColor: '#dc2626', // deep red
    darkBg: '#120404', // obsidian red-black
    accentGlow: 'rgba(239, 68, 68, 0.45)',
  },
  {
    id: 'athletic-cyan',
    name: 'Ciano Elétrico',
    primaryColor: '#06b6d4', // electric cyan (first blue)
    secondaryColor: '#0284c7', // athletic blue
    darkBg: '#040d1a', // deep navy-black
    accentGlow: 'rgba(6, 182, 212, 0.45)',
  },
  {
    id: 'iron-gold',
    name: 'Dourado Iron Gold',
    primaryColor: '#eab308', // iron gold
    secondaryColor: '#ca8a04', // deep gold
    darkBg: '#0c0a06', // luxury charcoal
    accentGlow: 'rgba(234, 179, 8, 0.45)',
  },
  {
    id: 'emerald-green',
    name: 'Verde Esmeralda',
    primaryColor: '#10b981', // emerald / neon green
    secondaryColor: '#059669', // dark green
    darkBg: '#04130c', // stealth black-green
    accentGlow: 'rgba(16, 185, 129, 0.45)',
  },
  {
    id: 'sunset-orange',
    name: 'Laranja Sunset',
    primaryColor: '#f97316', // vibrant orange (substituting second blue)
    secondaryColor: '#ea580c', // deep warm orange
    darkBg: '#150a04', // deep obsidian warm black
    accentGlow: 'rgba(249, 115, 22, 0.45)',
  },
]

export const DEFAULT_TRAINER: TrainerTemplate = {
  name: '',
  title: 'Personal Trainer & Consultoria Fitness',
  phone: '',
  instagram: '',
  message:
    'Qualquer dúvida, dificuldade ou necessidade de ajuste em relação ao treino, entre em contato comigo. Estou aqui para te apoiar no que for preciso!',
  themePreset: 'magenta-neon',
  primaryColor: '#c026d3',
  secondaryColor: '#9333ea',
  darkBg: '#090514',
  accentGlow: 'rgba(217, 38, 169, 0.45)',
  logoType: 'silhouette',
}

export class TrainerService {
  static getColorThemes(): ColorTheme[] {
    return COLOR_THEMES
  }

  static getColorThemeById(id: string): ColorTheme | undefined {
    return COLOR_THEMES.find((theme) => theme.id === id)
  }

  // Alias for backward compatibility
  static getPresets(): ColorTheme[] {
    return COLOR_THEMES
  }

  static getPresetById(id: string): ColorTheme | undefined {
    return this.getColorThemeById(id)
  }

  static getDefaultTrainer(): TrainerTemplate {
    return { ...DEFAULT_TRAINER }
  }

  static applyColorTheme(current: TrainerTemplate, theme: ColorTheme): TrainerTemplate {
    return {
      ...current,
      themePreset: theme.id,
      primaryColor: theme.primaryColor,
      secondaryColor: theme.secondaryColor,
      darkBg: theme.darkBg,
      accentGlow: theme.accentGlow,
    }
  }

  static updateTrainer(current: TrainerTemplate, updates: Partial<TrainerTemplate>): TrainerTemplate {
    return {
      ...current,
      ...updates,
      accentGlow: updates.primaryColor ? `${updates.primaryColor}55` : current.accentGlow,
    }
  }
}
