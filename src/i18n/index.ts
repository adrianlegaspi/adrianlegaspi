import { en } from './en'
import { es } from './es'

export const locales = ['en', 'es'] as const
export type Locale = (typeof locales)[number]

export type Strings = typeof en

const dictionaries: Record<Locale, Strings> = { en, es }

export const strings = (locale: Locale): Strings => dictionaries[locale]

export const isLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value)
