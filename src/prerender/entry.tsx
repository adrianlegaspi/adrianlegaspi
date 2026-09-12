import { renderToStaticMarkup } from 'react-dom/server'
import { panelContent } from '@/app/panelContent'
import { legalRoutes, localized, paths } from '@/app/routes'
import { absolute, seoFor } from '@/app/seo'
import { selectionFor } from '@/app/selection'
import { doc, projects } from '@/content/registry'
import { page } from '@/content/pages'
import { profile } from '@/data/profile'
import { strings, locales, type Locale } from '@/i18n'
import { Document } from './Document'
import { graph } from './jsonld'

/**
 * Build-time render of every route in every locale (spec §30).
 *
 * `tools/prerender.mjs` calls `pages()` and stamps each result into the shell
 * Vite produced, so the deployed site serves real HTML per URL instead of one
 * empty root div. Nothing here may touch `window`: it runs in Node.
 */

export interface Prerendered {
  /** Path inside dist, e.g. `projects/depguard/index.html`. */
  file: string
  lang: Locale
  /** Replaces the `seo` marker region in the shell's head. */
  head: string
  /** Goes inside `<div id="root">`, where React overwrites it on mount. */
  body: string
  /** Canonical URL, for the sitemap. */
  url: string
  alternates: { hreflang: string; href: string }[]
}

const escape = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/** `<` is escaped so a value can never close the script element early. */
const jsonScript = (data: unknown) =>
  `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`

const fileFor = (locale: Locale, path: string) => {
  const route = localized(locale, path).replace(/^\//, '')
  return route ? `${route}/index.html` : 'index.html'
}

function render(locale: Locale, path: string): Prerendered {
  const selection = selectionFor(path)
  const t = strings(locale)
  const content = panelContent(selection, locale)
  const { title, description, url, alternates } = seoFor(content, t, locale, path)

  const head = [
    `<title>${escape(title)}</title>`,
    `<meta name="description" content="${escape(description)}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:title" content="${escape(title)}" />`,
    `<meta property="og:description" content="${escape(description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:locale" content="${locale}" />`,
    ...alternates.map((a) => `<link rel="alternate" hreflang="${a.hreflang}" href="${a.href}" />`),
    `<link rel="alternate" hreflang="x-default" href="${absolute('en', path)}" />`,
    jsonScript(graph(selection, locale, path, title, content?.title ?? t.name)),
  ].join('\n    ')

  return {
    file: fileFor(locale, path),
    lang: locale,
    head,
    body: renderToStaticMarkup(<Document selection={selection} locale={locale} />),
    url,
    alternates,
  }
}

export function pages(): Prerendered[] {
  return locales.flatMap((locale) => paths().map((path) => render(locale, path)))
}

/**
 * llms.txt (https://llmstxt.org): the site in one file, for the answer engines
 * that look for it. Built from the same registry as the routes, so a new
 * project lands here without anyone remembering to add it.
 */
export function llms(): string {
  const t = strings('en')
  const entry = (name: string, href: string, note: string) => `- [${name}](${href}): ${note}`

  return [
    `# ${t.name}`,
    '',
    `> ${t.name}, ${t.title}. Portfolio presented as an interactive 3D city, where every building is a project. Every page is also available as plain HTML at the URLs below, in English and Spanish (/es).`,
    '',
    '## Projects',
    '',
    ...projects.map((project) => {
      const content = doc(project, 'en')
      return entry(content.title, absolute('en', `/projects/${project.id}`), content.summary)
    }),
    '',
    '## About',
    '',
    entry(page('about', 'en').title, absolute('en', '/about'), page('about', 'en').summary),
    entry(page('contact', 'en').title, absolute('en', '/contact'), t.contact.cta),
    entry('CV', `${profile.site}${profile.cv}`, 'Curriculum vitae, PDF.'),
    '',
    '## Optional',
    '',
    ...Object.entries(legalRoutes).map(([route, id]) =>
      entry(page(id, 'en').title, absolute('en', route), 'Legal page.'),
    ),
    '',
  ].join('\n')
}
