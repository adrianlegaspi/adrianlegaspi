import { profile } from '@/data/profile'
import type { PanelContent } from './panelContent'
import type { Strings } from '@/i18n'

function metaTag(selector: string, attribute: 'content' | 'href') {
  let element = document.head.querySelector<HTMLElement>(selector)
  if (!element) {
    element = document.createElement(selector.startsWith('link') ? 'link' : 'meta')
    const match = /\[(.+?)="(.+?)"\]/.exec(selector)
    if (match) element.setAttribute(match[1], match[2])
    document.head.append(element)
  }
  return (value: string) => element.setAttribute(attribute, value)
}

/**
 * Title, description, canonical and Open Graph follow the selected route
 * (spec §30). No framework needed for four routes.
 */
export function applySeo(content: PanelContent | null, t: Strings, pathname: string) {
  const title = content ? `${content.title} — ${t.name}` : `${t.name} — ${t.title}`
  const description = content?.summary || t.city.hint
  const url = `${profile.site}${pathname === '/' ? '' : pathname}`

  document.title = title
  metaTag('meta[name="description"]', 'content')(description)
  metaTag('link[rel="canonical"]', 'href')(url)
  metaTag('meta[property="og:title"]', 'content')(title)
  metaTag('meta[property="og:description"]', 'content')(description)
  metaTag('meta[property="og:url"]', 'content')(url)
  metaTag('meta[property="og:type"]', 'content')('website')
}
