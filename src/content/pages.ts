import { parseFrontmatter } from './frontmatter'
import { locales, type Locale } from '@/i18n'

/** Static pages that are reached from a landmark rather than from a project. */
export type PageId = 'about' | 'contact'

export interface Page {
  title: string
  summary: string
  body: string
}

const modules = import.meta.glob<string>('./{about,contact}/*.md', {
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
}

export const page = (id: PageId, locale: Locale): Page => pages[id][locale] ?? pages[id].en
