import { profile } from '@/data/profile'
import { locales, type Locale, type Strings } from '@/i18n'
import { localized } from './routes'
import type { PanelContent } from './panelContent'

/** Absolute URL for a canonical path in one locale. */
export const absolute = (locale: Locale, path: string) => {
  const url = `${profile.site}${localized(locale, path)}`
  return url === profile.site ? `${url}/` : url
}

/** Title, description and canonical for one route. Shared with the prerender. */
export function seoFor(content: PanelContent | null, t: Strings, locale: Locale, path: string) {
  return {
    title: content ? `${content.title} — ${t.name}` : `${t.name} — ${t.title}`,
    description: content?.summary || t.city.hint,
    url: absolute(locale, path),
    /** hreflang pairs. Each locale points at every locale, itself included. */
    alternates: locales.map((value) => ({ hreflang: value, href: absolute(value, path) })),
  }
}

function head<T extends HTMLElement>(selector: string, tag: 'meta' | 'link') {
  let element = document.head.querySelector<T>(selector)
  if (!element) {
    element = document.createElement(tag) as unknown as T
    for (const [, name, value] of selector.matchAll(/\[(.+?)="(.+?)"\]/g)) {
      element.setAttribute(name, value)
    }
    document.head.append(element)
  }
  return element
}

const set = (selector: string, tag: 'meta' | 'link', attribute: string, value: string) =>
  head(selector, tag).setAttribute(attribute, value)

/**
 * Keeps the head in step with the route (spec §30). The prerendered HTML already
 * carries the right tags for the URL that was requested; this only matters once
 * the visitor navigates inside the SPA.
 */
export function applySeo(content: PanelContent | null, t: Strings, locale: Locale, path: string) {
  const { title, description, url, alternates } = seoFor(content, t, locale, path)

  document.title = title
  set('meta[name="description"]', 'meta', 'content', description)
  set('link[rel="canonical"]', 'link', 'href', url)
  set('meta[property="og:title"]', 'meta', 'content', title)
  set('meta[property="og:description"]', 'meta', 'content', description)
  set('meta[property="og:url"]', 'meta', 'content', url)
  set('meta[property="og:type"]', 'meta', 'content', 'website')
  set('meta[property="og:locale"]', 'meta', 'content', locale)
  for (const alternate of alternates) {
    const selector = `link[rel="alternate"][hreflang="${alternate.hreflang}"]`
    set(selector, 'link', 'href', alternate.href)
  }
  set('link[rel="alternate"][hreflang="x-default"]', 'link', 'href', absolute('en', path))
}
