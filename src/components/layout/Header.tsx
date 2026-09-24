import { useCallback, useRef, useState } from 'react'
import { Menu as MenuIcon, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { usePortfolio } from '@/app/providers/portfolio'
import { localized } from '@/app/routes'
import { LanguageSelector } from '@/components/navigation/LanguageSelector'
import { MainNavigation } from '@/components/navigation/MainNavigation'
import { SoundToggle } from '@/components/navigation/SoundToggle'
import { TimeThemeSelector } from '@/components/navigation/TimeThemeSelector'
import { Button, cx, focusRing, icon, surface, Text, useDismiss } from '@/design-system'

/**
 * Minimal by design: the city carries the personality (spec §21/§22). On
 * mobile everything but the time of day folds into one drawer (spec §17).
 */
export function Header() {
  const { t, layout, locale } = usePortfolio()
  const [menuOpen, setMenuOpen] = useState(false)
  const root = useRef<HTMLElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const closeMenu = useCallback(() => setMenuOpen(false), [])
  useDismiss(menuOpen, closeMenu, root, trigger)
  const mobile = layout === 'mobile'

  return (
    <header
      ref={root}
      className={cx(
        'pointer-events-auto absolute inset-x-0 top-0 z-30 flex items-center gap-4 border-b px-4 py-2 sm:px-6 sm:py-3',
        surface.bar,
      )}
    >
      <Link
        to={localized(locale, '/')}
        className={cx('min-w-0 rounded-control', focusRing)}
        onClick={closeMenu}
      >
        <Text as="h1" tone="heading" className="truncate leading-tight">
          {t.name}
        </Text>
        <Text tone="body" className="truncate text-xs text-ink-subtle">
          {t.title}
        </Text>
      </Link>
      <div className="ml-auto flex shrink-0 items-center gap-2">
        {mobile ? (
          <>
            <TimeThemeSelector />
            <Button
              ref={trigger}
              variant="icon"
              aria-label={t.nav.menu}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? <X {...icon} /> : <MenuIcon {...icon} />}
            </Button>
          </>
        ) : (
          <>
            <MainNavigation />
            <span aria-hidden className="mx-1 h-6 w-px bg-line" />
            <SoundToggle />
            <TimeThemeSelector />
            <LanguageSelector />
          </>
        )}
      </div>
      {mobile && menuOpen && (
        // Any link inside leaves this view, so following one closes the drawer.
        <div
          id="mobile-menu"
          onClick={(event) => (event.target as Element).closest('a') && closeMenu()}
          className={cx(
            'absolute inset-x-0 top-full max-h-[calc(100dvh-4rem)] overflow-y-auto border-b px-4 py-2',
            surface.panel,
          )}
        >
          <MainNavigation stacked />
          <div className="mt-2 flex items-center justify-between border-t border-line pt-2">
            <SoundToggle />
            <LanguageSelector />
          </div>
        </div>
      )}
    </header>
  )
}
