import { doc } from '@/content/registry'
import { page } from '@/content/pages'
import { strings, type Locale } from '@/i18n'
import type { Selection } from './selection'

/** What a panel link points at, so the UI can give it the right icon. */
export type LinkKind =
  'website' | 'appStore' | 'playStore' | 'github' | 'demo' | 'email' | 'linkedin' | 'resume'

export interface PanelContent {
  id: string
  title: string
  /** Small line above the title: project type or landmark label. */
  eyebrow: string
  role: string | null
  dates: string | null
  summary: string
  body: string
  technologies: string[]
  links: { kind: LinkKind; label: string; href: string }[]
  confidential: boolean
  placeholder: boolean
}

const year = (value: string) => value.slice(0, 4)

/** Everything the case-study panel shows, in the visitor's language. */
export function panelContent(selection: Selection, locale: Locale): PanelContent | null {
  if (!selection) return null
  const t = strings(locale)

  if (selection.kind === 'landmark') {
    const content = page(selection.landmark.page, locale)
    return {
      id: selection.id,
      title: content.title,
      eyebrow: selection.landmark.page === 'about' ? t.nav.about : t.nav.contact,
      role: null,
      dates: null,
      summary: content.summary,
      body: content.body,
      technologies: [],
      links: [],
      confidential: false,
      placeholder: false,
    }
  }

  const project = selection.project
  const content = doc(project, locale)
  const { start, end } = project.dates
  const startYear = year(start)
  const endYear = end ? year(end) : t.panel.present
  const links: PanelContent['links'] = []
  if (project.links.website)
    links.push({ kind: 'website', label: t.panel.website, href: project.links.website })
  if (project.links.appStore)
    links.push({ kind: 'appStore', label: t.panel.appStore, href: project.links.appStore })
  if (project.links.playStore)
    links.push({ kind: 'playStore', label: t.panel.playStore, href: project.links.playStore })
  if (project.links.github)
    links.push({ kind: 'github', label: t.panel.github, href: project.links.github })
  if (project.links.demo)
    links.push({ kind: 'demo', label: t.panel.demo, href: project.links.demo })

  return {
    id: project.id,
    title: content.title,
    eyebrow: content.label ?? t.projectType[project.type],
    role: content.role ?? null,
    dates: startYear === endYear ? startYear : `${startYear} – ${endYear}`,
    summary: content.summary,
    body: content.body,
    technologies: project.technologies,
    links,
    confidential: project.confidential,
    placeholder: content.placeholder,
  }
}
