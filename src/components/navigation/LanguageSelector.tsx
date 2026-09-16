import { Fragment } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { usePortfolio } from '@/app/providers/portfolio'
import { localized, splitLocale } from '@/app/routes'
import { locales } from '@/i18n'
import { cx, focusRing } from '@/design-system'

/**
 * Both language choices stay visible without turning a small preference into
 * a prominent header control. Real links keep each locale crawlable and let
 * the pair declare each other with hreflang (spec §30).
 */
export function LanguageSelector() {
  const { locale, t } = usePortfolio()
  const { path } = splitLocale(useLocation().pathname)
  return (
    <div
      role="group"
      aria-label={t.language.label}
      className="inline-flex min-h-11 items-center text-xs uppercase tracking-[0.08em]"
    >
      {locales.map((value, index) => (
        <Fragment key={value}>
          {index > 0 && (
            <span aria-hidden className="text-ink-faint">
              /
            </span>
          )}
          <Link
            to={localized(value, path)}
            hrefLang={value}
            aria-current={locale === value ? 'true' : undefined}
            className={cx(
              'inline-flex min-h-11 min-w-7 items-center justify-center rounded-control px-1 font-medium transition-colors',
              focusRing,
              locale === value
                ? 'text-ink underline decoration-2 decoration-accent underline-offset-4'
                : 'text-ink-faint hover:text-ink',
            )}
          >
            {value}
          </Link>
        </Fragment>
      ))}
    </div>
  )
}
