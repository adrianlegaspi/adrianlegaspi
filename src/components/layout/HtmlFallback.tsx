import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { usePortfolio } from '@/app/providers/portfolio'
import { doc, projects } from '@/content/registry'
import { page, type PageId } from '@/content/pages'
import { profile } from '@/data/profile'
import { LanguageSelector } from '@/components/navigation/LanguageSelector'
import { ConfidentialProjectNotice } from '@/components/project/ConfidentialProjectNotice'
import { link, Prose, Text } from '@/design-system'

/**
 * The portfolio without WebGL: a plain document, not an error screen
 * (spec §34). Everything in the city is here as HTML.
 */
export function HtmlFallback() {
  const { t, locale } = usePortfolio()
  const { pathname } = useLocation()
  const about = page('about', locale)
  const contact = page('contact', locale)
  const legalPages: PageId[] = ['privacy', 'tos', 'eula', 'copyright']

  // The route still selects something, so jump to its section instead of the top.
  useEffect(() => {
    const id = pathname.startsWith('/projects/')
      ? `project-${pathname.slice('/projects/'.length)}`
      : pathname.slice(1)
    document.getElementById(id)?.scrollIntoView()
  }, [pathname])

  const anchors = [
    ...projects.map((project) => ({
      href: `#project-${project.id}`,
      label: doc(project, locale).title,
    })),
    { href: '#about', label: t.nav.about },
    { href: '#contact', label: t.nav.contact },
    ...legalPages.map((id) => ({ href: `#${id}`, label: page(id, locale).title })),
  ]

  const contactLinks: { label: string; href: string; newTab?: boolean }[] = [
    { label: t.contact.email, href: `mailto:${profile.email}` },
    { label: t.contact.linkedin, href: profile.linkedin },
    { label: t.contact.github, href: profile.github },
    // A PDF, not a route — a new tab leaves this page where it is.
    { label: t.contact.cv, href: profile.cv, newTab: true },
  ]

  return (
    <div className="mx-auto max-w-2xl px-5 py-10">
      <header className="flex items-start justify-between gap-4">
        <div>
          <Text as="h1" tone="title" className="text-2xl">
            {t.name}
          </Text>
          <Text tone="body" className="text-ink-subtle">
            {t.title}
          </Text>
        </div>
        <LanguageSelector />
      </header>

      <p className="mt-6 rounded-control bg-surface-sunk px-4 py-3 text-sm text-ink-muted">
        <strong className="font-semibold text-ink">{t.fallback.heading}.</strong> {t.fallback.body}
      </p>

      <nav aria-label={t.nav.projects} className="mt-8">
        <Text as="h2" tone="label">
          {t.nav.projects}
        </Text>
        <ul className="mt-2 space-y-1">
          {anchors.map((anchor) => (
            <li key={anchor.href}>
              <a href={anchor.href} className={`${link} text-sm`}>
                {anchor.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {projects.map((project) => {
        const content = doc(project, locale)
        return (
          <article key={project.id} id={`project-${project.id}`} className="mt-10 space-y-2">
            <Text tone="eyebrow">{content.label ?? t.projectType[project.type]}</Text>
            <Text as="h2" tone="title" className="text-xl">
              {content.title}
            </Text>
            <Text>{content.summary}</Text>
            {project.confidential && <ConfidentialProjectNotice />}
            <Prose>{content.body}</Prose>
          </article>
        )
      })}

      <article id="about" className="mt-12">
        <Text as="h2" tone="title" className="text-xl">
          {about.title}
        </Text>
        <Prose>{about.body}</Prose>
      </article>

      <article id="contact" className="mt-12">
        <Text as="h2" tone="title" className="text-xl">
          {t.contact.heading}
        </Text>
        <Text className="mt-2">{contact.summary || t.contact.cta}</Text>
        <ul className="mt-4 flex flex-wrap gap-3 text-sm">
          {contactLinks.map((item) => (
            <li key={item.href}>
              <a
                className={link}
                href={item.href}
                {...(item.newTab ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </article>

      {legalPages.map((id) => {
        const content = page(id, locale)
        return (
          <article key={id} id={id} className="mt-12">
            <Text as="h2" tone="title" className="text-xl">
              {content.title}
            </Text>
            <Prose>{content.body}</Prose>
          </article>
        )
      })}
    </div>
  )
}
