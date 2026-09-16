/**
 * One scene, four looks. Presets only change visual properties (spec §19),
 * no geometry, no extra scenes.
 */
export const timeThemes = ['dawn', 'day', 'sunset', 'night'] as const
export type TimeTheme = (typeof timeThemes)[number]

/** What the selector offers. `auto` follows the visitor's local clock. */
export const timeModes = ['auto', 'day', 'sunset', 'night'] as const
export type TimeMode = (typeof timeModes)[number]

export interface TimePreset {
  background: string
  fog: { color: string; near: number; far: number }
  ground: string
  park: string
  ambient: { color: string; intensity: number }
  sun: { color: string; intensity: number; position: [number, number, number] }
  /** Streetlights and window glow are the only night-only extras. */
  streetlights: boolean
  windowGlow: number
  /** Headlight strength on cars and the train; 0 leaves them dark. */
  vehicleLights: number
}

export const timePresets: Record<TimeTheme, TimePreset> = {
  dawn: {
    background: '#f7e2ba',
    fog: { color: '#f2d6a8', near: 22, far: 60 },
    ground: '#c9c2b6',
    park: '#87a86b',
    ambient: { color: '#ffd9c0', intensity: 1.5 },
    sun: { color: '#ffb27a', intensity: 1.6, position: [-14, 8, 10] },
    streetlights: true,
    windowGlow: 0.15,
    vehicleLights: 0.4,
  },
  day: {
    background: '#bfe3f5',
    fog: { color: '#d8ecf7', near: 28, far: 75 },
    ground: '#d6d2c8',
    park: '#8fbf6b',
    ambient: { color: '#ffffff', intensity: 2 },
    sun: { color: '#fff6e6', intensity: 2.6, position: [12, 18, 9] },
    streetlights: false,
    windowGlow: 0,
    vehicleLights: 0,
  },
  sunset: {
    background: '#e8a05a',
    fog: { color: '#dc9155', near: 22, far: 62 },
    ground: '#c8b8a4',
    park: '#7f9a5f',
    ambient: { color: '#ffcfa6', intensity: 1.6 },
    sun: { color: '#ff9a52', intensity: 2.2, position: [16, 5, -8] },
    streetlights: true,
    windowGlow: 0.25,
    vehicleLights: 0.5,
  },
  night: {
    background: '#151b35',
    fog: { color: '#0e1226', near: 16, far: 48 },
    ground: '#3b4152',
    park: '#37503a',
    ambient: { color: '#93a7d1', intensity: 0.7 },
    sun: { color: '#8fa5d6', intensity: 0.5, position: [-8, 14, -12] },
    streetlights: true,
    windowGlow: 0.45,
    vehicleLights: 1,
  },
}

/** Spec §19 mapping, in the visitor's local time. No geolocation. */
export function themeForHour(hour: number): TimeTheme {
  if (hour >= 5 && hour < 8) return 'dawn'
  if (hour >= 8 && hour < 17) return 'day'
  if (hour >= 17 && hour < 20) return 'sunset'
  return 'night'
}

export const resolveTheme = (mode: TimeMode, now = new Date()): TimeTheme =>
  mode === 'auto' ? themeForHour(now.getHours()) : mode

const STORAGE_KEY = 'legaspi.time-mode'

export const isTimeMode = (value: string): value is TimeMode =>
  (timeModes as readonly string[]).includes(value)

export function initialTimeMode(): TimeMode {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored && isTimeMode(stored)) return stored
  } catch {
    // Storage can throw in private browsing.
  }
  return 'auto'
}

export function storeTimeMode(mode: TimeMode) {
  try {
    localStorage.setItem(STORAGE_KEY, mode)
  } catch {
    // Preference is a convenience.
  }
}
