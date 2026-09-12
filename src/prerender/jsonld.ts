import { absolute } from '@/app/seo'
import type { Selection } from '@/app/selection'
import { doc, projects } from '@/content/registry'
import { page } from '@/content/pages'
import { profile } from '@/data/profile'
import { strings, type Locale } from '@/i18n'

/**
 * Schema.org graph for one route (spec §30). Answer engines rarely execute
 * JavaScript, so the entity facts have to be in the served HTML: who Adrian is,
 * what he built, and which URL states each claim.
 *
 * Every contact fact here comes from `profile`, which is confirmed against the
 * live site: this is published as machine-readable truth, not as a guess.
 */
const PERSON = '#person'
const SITE = '#website'

type Json = Record<string, unknown>

const id = (fragment: string) => `${profile.site}/${fragment}`

/** Every technology named by a project, deduplicated. Drives `knowsAbout`. */
const expertise = [...new Set(projects.flatMap((project) => project.technologies))].sort()

function person(locale: Locale): Json {
  const t = strings(locale)
  return {
    '@type': 'Person',
    '@id': id(PERSON),
    name: t.name,
    jobTitle: t.title,
    url: absolute(locale, '/'),
    description: page('about', locale).summary,
    image: `${profile.site}/og-image.png`,
    email: `mailto:${profile.email}`,
    sameAs: [profile.linkedin, profile.github, profile.x],
    knowsAbout: expertise,
    knowsLanguage: ['en', 'es'],
  }
}

function website(locale: Locale): Json {
  return {
    '@type': 'WebSite',
    '@id': id(SITE),
    url: absolute(locale, '/'),
    name: strings(locale).name,
    inLanguage: locale,
    author: { '@id': id(PERSON) },
    publisher: { '@id': id(PERSON) },
  }
}

function projectWork(
  selection: Extract<Selection, { kind: 'project' }>,
  locale: Locale,
  url: string,
): Json {
  const { project } = selection
  const content = doc(project, locale)
  const external = Object.values(project.links).filter((href): href is string => Boolean(href))
  return {
    '@type': 'CreativeWork',
    '@id': `${url}#work`,
    name: content.title,
    headline: content.title,
    description: content.summary,
    url,
    inLanguage: locale,
    dateCreated: project.dates.start,
    ...(project.dates.end ? { datePublished: project.dates.end } : {}),
    keywords: project.technologies.join(', '),
    author: { '@id': id(PERSON) },
    creator: { '@id': id(PERSON) },
    isPartOf: { '@id': id(SITE) },
    ...(external.length ? { sameAs: external } : {}),
  }
}

/**
 * Home reads as a profile page; everything else as a page about one thing.
 * `title` is the full page title, `name` the bare subject used in the trail.
 */
export function graph(
  selection: Selection,
  locale: Locale,
  path: string,
  title: string,
  name: string,
): Json {
  const url = absolute(locale, path)
  const nodes: Json[] = [person(locale), website(locale)]

  if (path === '/') {
    nodes.push({
      '@type': ['WebPage', 'ProfilePage'],
      '@id': url,
      url,
      name: title,
      inLanguage: locale,
      isPartOf: { '@id': id(SITE) },
      mainEntity: { '@id': id(PERSON) },
      about: { '@id': id(PERSON) },
      hasPart: projects.map((project) => ({
        '@type': 'CreativeWork',
        name: doc(project, locale).title,
        url: absolute(locale, `/projects/${project.id}`),
      })),
    })
    return { '@context': 'https://schema.org', '@graph': nodes }
  }

  const work = selection?.kind === 'project' ? projectWork(selection, locale, url) : null
  if (work) nodes.push(work)

  nodes.push({
    '@type': 'WebPage',
    '@id': url,
    url,
    name: title,
    inLanguage: locale,
    isPartOf: { '@id': id(SITE) },
    about: work ? { '@id': work['@id'] } : { '@id': id(PERSON) },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: strings(locale).name,
          item: absolute(locale, '/'),
        },
        { '@type': 'ListItem', position: 2, name, item: url },
      ],
    },
  })

  return { '@context': 'https://schema.org', '@graph': nodes }
}
