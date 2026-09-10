import { AtSign, Building2, FileText, UserRound } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { usePortfolio } from '@/app/providers/portfolio'
import { projects, doc } from '@/content/registry'
import { profile } from '@/data/profile'
import { ActionLink, control, cx, icon, Menu, menuItem } from '@/design-system'

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
    </nav>
  )
}
