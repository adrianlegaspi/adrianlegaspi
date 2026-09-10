import { en } from './en'
import { es } from './es'

export const locales = ['en', 'es'] as const
export type Locale = (typeof locales)[number]

export type Strings = typeof en

const dictionaries: Record<Locale, Strings> = { en, es }

export const strings = (locale: Locale): Strings => dictionaries[locale]

const STORAGE_KEY = 'legaspi.locale'

export const isLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value)

/** Stored preference first, then browser language, then English. */
export function initialLocale(): Locale {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored && isLocale(stored)) return stored
  } catch {
    // Private browsing modes can throw on storage access.
  }
  return navigator.language?.toLowerCase().startsWith('es') ? 'es' : 'en'
}

export function storeLocale(locale: Locale) {
  try {
    localStorage.setItem(STORAGE_KEY, locale)
  } catch {
    // Preference is a convenience, not a requirement.
  }
}
