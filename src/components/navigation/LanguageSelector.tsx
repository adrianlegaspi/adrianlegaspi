import { Languages } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { usePortfolio } from '@/app/providers/portfolio'
import { localized, splitLocale } from '@/app/routes'
import { locales } from '@/i18n'
import { control, icon } from '@/design-system'

/**
 * Two options stay segmented: a dropdown would hide half the answer. Real
 * links, not a toggle, so each language is a crawlable URL and the pair can
 * declare each other with hreflang (spec §30).
 */
export function LanguageSelector() {
  const { locale, t } = usePortfolio()
  const { path } = splitLocale(useLocation().pathname)
  return (
    <div
      role="group"
      aria-label={t.language.label}
      className="inline-flex items-center gap-0.5 rounded-control border border-line pl-2 text-ink-faint"
    >
      <Languages {...icon} />
      {locales.map((value) => (
        <Link
          key={value}
          to={localized(value, path)}
          hrefLang={value}
          aria-current={locale === value ? 'true' : undefined}
          className={control('toggle', locale === value)}
        >
          {value}
        </Link>
      ))}
    </div>
  )
}
