import { useState } from 'react'
import { AtSign, Building2, FileText, Scale, Search, UserRound } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { usePortfolio } from '@/app/providers/portfolio'
import { legalRoutes, localized, splitLocale } from '@/app/routes'
import { projects, doc } from '@/content/registry'
import { page, type PageId } from '@/content/pages'
import { profile } from '@/data/profile'
import { ActionLink, control, cx, focusRing, icon, Menu, menuItem } from '@/design-system'

/** App store submission requires these to exist; they carry no landmark. */
const legalPages: { route: string; id: PageId }[] = Object.entries(legalRoutes).map(
  ([route, id]) => ({ route, id }),
)

/**
 * The same city state, reachable without WebGL or a mouse (spec §23/§29).
 * `stacked` lays it out as a full-width list for the mobile drawer.
 */
export function MainNavigation({ stacked = false }: { stacked?: boolean }) {
  const { t, locale } = usePortfolio()
  const [projectQuery, setProjectQuery] = useState('')
  // Compared and linked without the locale prefix, so /es/about is still "about".
  const { path } = splitLocale(useLocation().pathname)
  const to = (target: string) => localized(locale, target)
  const query = projectQuery.trim().toLocaleLowerCase(locale)
  const matchingProjects = query
    ? projects.filter((project) =>
        doc(project, locale).title.toLocaleLowerCase(locale).includes(query),
      )
    : projects
  const item = stacked && 'justify-start'

  return (
    <nav
      aria-label={t.nav.menu}
      className={cx('flex gap-x-1', stacked ? 'flex-col' : 'flex-wrap items-center')}
    >
      <Menu
        ariaLabel={t.nav.projects}
        active={path.startsWith('/projects')}
        width="w-72"
        scrollable
        inline={stacked}
        label={
          <>
            <Building2 {...icon} />
            {t.nav.projects}
          </>
        }
        header={
          <label className="relative block">
            <span className="sr-only">{t.nav.searchProjects}</span>
            <Search
              {...icon}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint"
            />
            <input
              type="search"
              value={projectQuery}
              onChange={(event) => setProjectQuery(event.target.value)}
              placeholder={t.nav.searchProjects}
              className={cx(
                'min-h-11 w-full rounded-control border border-line bg-surface-bare py-2 pl-9 pr-3 text-sm text-ink placeholder:text-ink-faint',
                focusRing,
              )}
            />
          </label>
        }
      >
        {(close) => (
          <ul>
            {matchingProjects.length ? (
              matchingProjects.map((project) => (
                <li key={project.id}>
                  <Link
                    to={to(`/projects/${project.id}`)}
                    role="menuitem"
                    onClick={close}
                    aria-current={path === `/projects/${project.id}` ? 'page' : undefined}
                    className={cx(menuItem, 'flex min-h-11 flex-col justify-center')}
                  >
                    <span>{doc(project, locale).title}</span>
                    <span className="text-xs text-ink-faint">{t.projectType[project.type]}</span>
                  </Link>
                </li>
              ))
            ) : (
              <li>
                <span
                  role="menuitem"
                  aria-disabled="true"
                  className="block px-2.5 py-3 text-sm text-ink-subtle"
                >
                  {t.nav.noMatchingProjects}
                </span>
              </li>
            )}
          </ul>
        )}
      </Menu>

      <Link
        to={to('/about')}
        className={cx(control('nav', path === '/about'), 'gap-1.5', item)}
        aria-current={path === '/about' ? 'page' : undefined}
      >
        <UserRound {...icon} />
        {t.nav.about}
      </Link>
      <Link
        to={to('/contact')}
        className={cx(control('nav', path === '/contact'), 'gap-1.5', item)}
        aria-current={path === '/contact' ? 'page' : undefined}
      >
        <AtSign {...icon} />
        {t.nav.contact}
      </Link>
      <ActionLink variant="nav" href={profile.cv} className={cx('gap-1.5', item)}>
        <FileText {...icon} />
        {t.nav.cv}
      </ActionLink>

      <Menu
        ariaLabel={t.nav.legal}
        active={legalPages.some((entry) => path === entry.route)}
        width="w-72"
        inline={stacked}
        label={
          <>
            <Scale {...icon} />
            {t.nav.legal}
          </>
        }
      >
        {(close) => (
          <ul>
            {legalPages.map(({ route, id }) => (
              <li key={route}>
                <Link
                  to={to(route)}
                  role="menuitem"
                  onClick={close}
                  aria-current={path === route ? 'page' : undefined}
                  className={cx(menuItem, 'block text-balance')}
                >
                  {page(id, locale).title}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Menu>
    </nav>
  )
}
