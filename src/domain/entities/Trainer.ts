export type ThemePreset =
  | 'magenta-neon'
  | 'crimson-red'
  | 'athletic-cyan'
  | 'iron-gold'
  | 'emerald-green'
  | 'sunset-orange'

export type LogoType = 'silhouette' | 'dumbbell' | 'flame' | 'shield' | 'custom'

export interface ColorTheme {
  id: ThemePreset
  name: string
  primaryColor: string
  secondaryColor: string
  darkBg: string
  accentGlow: string
}

export interface TrainerTemplate {
  name: string
  title: string
  phone: string
  instagram: string
  message: string
  themePreset: ThemePreset
  primaryColor: string
  secondaryColor: string
  darkBg: string
  accentGlow: string
  logoType: LogoType
  customLogoUrl?: string
}
