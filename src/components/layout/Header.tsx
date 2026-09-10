import { Link } from 'react-router-dom'
import { usePortfolio } from '@/app/providers/portfolio'
import { LanguageSelector } from '@/components/navigation/LanguageSelector'
import { MainNavigation } from '@/components/navigation/MainNavigation'
import { TimeThemeSelector } from '@/components/navigation/TimeThemeSelector'
import { cx, focusRing, surface, Text } from '@/design-system'

/** Minimal by design: the city carries the personality (spec §21/§22). */
export function Header() {
  const { t, layout } = usePortfolio()
  return (
    <header
      className={cx(
        'pointer-events-auto absolute inset-x-0 top-0 z-30 flex flex-wrap items-center',
        'gap-x-4 gap-y-2 border-b px-4 py-3 sm:px-6',
        surface.bar,
      )}
    >
      <Link to="/" className={cx('rounded-control', focusRing)}>
        <Text as="h1" tone="heading" className="leading-tight">
          {t.name}
        </Text>
        <Text tone="body" className="text-xs text-ink-subtle">
          {t.title}
        </Text>
      </Link>
      <div className="ml-auto flex items-center gap-2">
        {layout === 'desktop' && (
          <>
            <MainNavigation />
            <span aria-hidden className="mx-1 h-6 w-px bg-line" />
          </>
        )}
        <TimeThemeSelector />
        <LanguageSelector />
      </div>
      {layout === 'mobile' && (
        <div className="w-full">
          <MainNavigation />
        </div>
      )}
    </header>
  )
}
