import { parseFrontmatter } from './frontmatter'
import { locales, type Locale } from '@/i18n'

/**
 * Static pages that are reached from a landmark, plus the legal pages required
 * for app store submission, which are reached by direct URL only and have no
 * building in the city.
 */
export type PageId = 'about' | 'contact' | 'privacy' | 'tos' | 'eula' | 'copyright'

export interface Page {
  title: string
  summary: string
  body: string
}

const modules = import.meta.glob<string>('./{about,contact,privacy,tos,eula,copyright}/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
})

function read(id: PageId, locale: Locale): Page | null {
  const raw = modules[`./${id}/${locale}.md`]
  if (raw === undefined) return null
  const { data, body } = parseFrontmatter(raw)
  const title = typeof data.title === 'string' ? data.title : ''
  if (!title) return null
  return { title, summary: typeof data.summary === 'string' ? data.summary : '', body }
}

function load(id: PageId): Record<Locale, Page> {
  const english = read(id, 'en')
  if (!english) throw new Error(`content: ${id}/en.md is required`)
  const pages = { en: english } as Record<Locale, Page>
  for (const locale of locales) {
    if (locale === 'en') continue
    pages[locale] = read(id, locale) ?? english
  }
  return pages
}

const pages: Record<PageId, Record<Locale, Page>> = {
  about: load('about'),
  contact: load('contact'),
  privacy: load('privacy'),
  tos: load('tos'),
  eula: load('eula'),
  copyright: load('copyright'),
}

export const page = (id: PageId, locale: Locale): Page => pages[id][locale] ?? pages[id].en
