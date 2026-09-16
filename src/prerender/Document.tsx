import { panelContent } from '@/app/panelContent'
import { localized } from '@/app/routes'
import type { Selection } from '@/app/selection'
import { doc, projects } from '@/content/registry'
import { page } from '@/content/pages'
import { strings, type Locale } from '@/i18n'
import { legalRoutes } from '@/app/routes'
import { link, Prose, Tag, Text } from '@/design-system'

/**
 * The crawlable body of one route, rendered at build time (spec §30).
 *
 * React replaces this the moment the bundle mounts, so it is never what a
 * visitor interacts with; it exists for the crawlers and answer engines that
 * read HTML and do not run JavaScript. Because of that it renders one route's
 * content, not the whole portfolio: fourteen URLs sharing one body would be
 * fourteen duplicates.
 */

function Nav({ locale }: { locale: Locale }) {
  const t = strings(locale)
  const to = (path: string) => localized(locale, path)
  return (
    <nav aria-label={t.nav.menu} className="mt-8 text-sm">
      <Text as="h2" tone="label">
        {t.nav.projects}
      </Text>
      <ul className="mt-2 space-y-1">
        {projects.map((project) => (
          <li key={project.id}>
            <a className={link} href={to(`/projects/${project.id}`)}>
              {doc(project, locale).title}
            </a>
          </li>
        ))}
        <li>
          <a className={link} href={to('/about')}>
            {t.nav.about}
          </a>
        </li>
        <li>
          <a className={link} href={to('/contact')}>
            {t.nav.contact}
          </a>
        </li>
        {Object.entries(legalRoutes).map(([route, id]) => (
          <li key={route}>
            <a className={link} href={to(route)}>
              {page(id, locale).title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

function Home({ locale }: { locale: Locale }) {
  const t = strings(locale)
  const about = page('about', locale)
  return (
    <>
      <Text as="h1" tone="title">
        {t.name}
      </Text>
      <Text tone="meta">{t.title}</Text>
      <Text className="mt-3">{t.city.canvasLabel}</Text>

      <section className="mt-10">
        <Text as="h2" tone="title" className="text-xl">
          {t.nav.projects}
        </Text>
        {projects.map((project) => {
          const content = doc(project, locale)
          return (
            <article key={project.id} className="mt-6">
              <Text as="h3" tone="heading">
                <a className={link} href={localized(locale, `/projects/${project.id}`)}>
                  {content.title}
                </a>
              </Text>
              <Text tone="eyebrow">{content.label ?? t.projectType[project.type]}</Text>
              <Text className="mt-1">{content.summary}</Text>
            </article>
          )
        })}
      </section>

      <section className="mt-10">
        <Text as="h2" tone="title" className="text-xl">
          {about.title}
        </Text>
        <Prose>{about.body}</Prose>
      </section>
    </>
  )
}

export function Document({ selection, locale }: { selection: Selection; locale: Locale }) {
  const t = strings(locale)
  const content = panelContent(selection, locale)

  return (
    <div className="mx-auto max-w-2xl px-5 py-10">
      {content === null ? (
        <Home locale={locale} />
      ) : (
        <article>
          <Text tone="eyebrow">{content.eyebrow}</Text>
          <Text as="h1" tone="title">
            {content.title}
          </Text>
          {content.role && <Text tone="meta">{`${t.panel.role}: ${content.role}`}</Text>}
          {content.dates && <Text tone="meta">{`${t.panel.dates}: ${content.dates}`}</Text>}
          <Text className="mt-3">{content.summary}</Text>
          {content.confidential && <Text className="mt-3">{t.confidential.notice}</Text>}
          <Prose>{content.body}</Prose>

          {content.technologies.length > 0 && (
            <section className="mt-6">
              <Text as="h2" tone="label">
                {t.panel.technologies}
              </Text>
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {content.technologies.map((technology) => (
                  <li key={technology}>
                    <Tag>{technology}</Tag>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {content.links.length > 0 && (
            <section className="mt-6">
              <Text as="h2" tone="label">
                {t.panel.links}
              </Text>
              <ul className="mt-2 flex flex-wrap gap-3 text-sm">
                {content.links.map((entry) => (
                  <li key={entry.href}>
                    {entry.kind === 'email' ? (
                      <span>{entry.href.slice('mailto:'.length)}</span>
                    ) : (
                      <a className={link} href={entry.href} rel="noreferrer noopener">
                        {entry.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </article>
      )}
      <Nav locale={locale} />
    </div>
  )
}
