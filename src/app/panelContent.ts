import { doc } from '@/content/registry'
import { page } from '@/content/pages'
import { profile } from '@/data/profile'
import { strings, type Locale } from '@/i18n'
import type { Selection } from './selection'

/** What a panel link points at, so the UI can give it the right icon. */
export type LinkKind =
  | 'website'
  | 'appStore'
  | 'playStore'
  | 'github'
  | 'npm'
  | 'demo'
  | 'email'
  | 'linkedin'
  | 'x'
  | 'cv'

export interface PanelContent {
  id: string
  title: string
  icon: string | null
  /** Small line above the title: project type or landmark label. */
  eyebrow: string
  role: string | null
  dates: string | null
  summary: string
  body: string
  technologies: string[]
  links: { kind: LinkKind; label: string; href: string }[]
  media: { src: string; alt: string; width: number; height: number }[]
  confidential: boolean
}

const year = (value: string) => value.slice(0, 4)

/**
 * How to reach Adrian. The construction site is the end-of-experience call to
 * action (spec §10), and the same list is what the no-WebGL page and the
 * prerendered /contact route show, so it lives here rather than in each of them.
 */
export function contactLinks(locale: Locale): PanelContent['links'] {
  const t = strings(locale)
  return [
    { kind: 'email', label: t.contact.email, href: `mailto:${profile.email}` },
    { kind: 'linkedin', label: t.contact.linkedin, href: profile.linkedin },
    { kind: 'github', label: t.contact.github, href: profile.github },
    { kind: 'x', label: t.contact.x, href: profile.x },
    {
      kind: 'cv',
      // The CV is only written in English, so the Spanish panel has to say so.
      label: `${t.contact.cv} (${t.contact.cvLanguage}, ${Math.round(profile.cvSizeBytes / 1024)} KB)`,
      href: profile.cv,
    },
  ]
}

/** Everything the case-study panel shows, in the visitor's language. */
export function panelContent(selection: Selection, locale: Locale): PanelContent | null {
  if (!selection) return null
  const t = strings(locale)

  if (selection.kind === 'landmark') {
    const content = page(selection.landmark.page, locale)
    return {
      id: selection.id,
      title: content.title,
      icon: null,
      eyebrow: selection.landmark.page === 'about' ? t.nav.about : t.nav.contact,
      role: null,
      dates: null,
      summary: content.summary,
      body: content.body,
      technologies: [],
      links: selection.landmark.page === 'contact' ? contactLinks(locale) : [],
      media: [],
      confidential: false,
    }
  }

  if (selection.kind === 'legal') {
    const content = page(selection.page, locale)
    return {
      id: selection.id,
      title: content.title,
      icon: null,
      eyebrow: t.nav.legal,
      role: null,
      dates: null,
      summary: content.summary,
      body: content.body,
      technologies: [],
      links: [],
      media: [],
      confidential: false,
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
  if (project.links.npm) links.push({ kind: 'npm', label: t.panel.npm, href: project.links.npm })
  if (project.links.demo)
    links.push({ kind: 'demo', label: t.panel.demo, href: project.links.demo })

  return {
    id: project.id,
    title: content.title,
    icon: project.icon ?? null,
    eyebrow: content.label ?? t.projectType[project.type],
    role: content.role ?? null,
    dates: startYear === endYear ? startYear : `${startYear} – ${endYear}`,
    summary: content.summary,
    body: content.body,
    technologies: project.technologies,
    links,
    media: project.media,
    confidential: project.confidential,
  }
}
