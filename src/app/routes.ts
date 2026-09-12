import { projects } from '@/content/registry'
import type { PageId } from '@/content/pages'
import { landmarks } from '@/data/landmarks'
import { locales, type Locale } from '@/i18n'

/** Legal pages required for app store submission. No building in the city. */
export const legalRoutes: Record<string, PageId> = {
  '/privacy': 'privacy',
  '/tos': 'tos',
  '/eula': 'eula',
  '/copyright': 'copyright',
}

/**
 * Every canonical path, without a locale prefix. The router, the prerender and
 * the sitemap all walk this list, so a new project appears in all three.
 */
export const paths = (): string[] => [
  '/',
  ...landmarks.map((landmark) => landmark.route),
  ...Object.keys(legalRoutes),
  ...projects.map((project) => `/projects/${project.id}`),
]

/** English is unprefixed, so every link written before /es existed still resolves. */
const prefixed = locales.filter((locale) => locale !== 'en')

const trim = (pathname: string) => pathname.replace(/\/+$/, '') || '/'

/** Splits `/es/projects/depguard` into the locale and the canonical path. */
export function splitLocale(pathname: string): { locale: Locale; path: string } {
  const clean = trim(pathname)
  for (const locale of prefixed) {
    if (clean === `/${locale}`) return { locale, path: '/' }
    if (clean.startsWith(`/${locale}/`)) return { locale, path: clean.slice(locale.length + 1) }
  }
  return { locale: 'en', path: clean }
}

/** The same page in one locale: `localized('es', '/about')` is `/es/about`. */
export const localized = (locale: Locale, path: string): string =>
  locale === 'en' ? path : `/${locale}${path === '/' ? '' : path}`
