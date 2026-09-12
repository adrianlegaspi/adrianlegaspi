import { AtSign, Building2, FileText, Scale, UserRound } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { usePortfolio } from '@/app/providers/portfolio'
import { projects, doc } from '@/content/registry'
import { page, type PageId } from '@/content/pages'
import { profile } from '@/data/profile'
import { ActionLink, control, cx, icon, Menu, menuItem } from '@/design-system'

/** App store submission requires these to exist; they carry no landmark. */
const legalPages: { route: string; id: PageId }[] = [
  { route: '/privacy', id: 'privacy' },
  { route: '/tos', id: 'tos' },
  { route: '/eula', id: 'eula' },
  { route: '/copyright', id: 'copyright' },
]

/**
 * The same city state, reachable without WebGL or a mouse (spec §23/§29).
 */
export function MainNavigation() {
  const { t, locale, setHoveredProjectId } = usePortfolio()
  const { pathname } = useLocation()

  return (
    <nav aria-label={t.nav.menu} className="flex flex-wrap items-center gap-x-1">
      <Menu
        ariaLabel={t.nav.projects}
        active={pathname.startsWith('/projects')}
        label={
          <>
            <Building2 {...icon} />
            {t.nav.projects}
          </>
        }
      >
        {(close) => (
          <ul>
            {projects.map((project) => (
              <li key={project.id}>
                <Link
                  to={`/projects/${project.id}`}
                  role="menuitem"
                  onClick={close}
                  onMouseEnter={() => setHoveredProjectId(project.id)}
                  onMouseLeave={() => setHoveredProjectId(null)}
                  aria-current={pathname === `/projects/${project.id}` ? 'page' : undefined}
                  className={cx(menuItem, 'flex min-h-11 flex-col justify-center')}
                >
                  <span>{doc(project, locale).title}</span>
                  <span className="text-xs text-ink-faint">{t.projectType[project.type]}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Menu>

      <Link
        to="/about"
        className={cx(control('nav', pathname === '/about'), 'gap-1.5')}
        aria-current={pathname === '/about' ? 'page' : undefined}
      >
        <UserRound {...icon} />
        {t.nav.about}
      </Link>
      <Link
        to="/contact"
        className={cx(control('nav', pathname === '/contact'), 'gap-1.5')}
        aria-current={pathname === '/contact' ? 'page' : undefined}
      >
        <AtSign {...icon} />
        {t.nav.contact}
      </Link>
      <ActionLink variant="nav" href={profile.cv} className="gap-1.5">
        <FileText {...icon} />
        {t.nav.cv}
      </ActionLink>

      <Menu
        ariaLabel={t.nav.legal}
        active={legalPages.some((entry) => pathname === entry.route)}
        width="w-72"
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
                  to={route}
                  role="menuitem"
                  onClick={close}
                  aria-current={pathname === route ? 'page' : undefined}
                  className={cx(menuItem, 'text-balance')}
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
