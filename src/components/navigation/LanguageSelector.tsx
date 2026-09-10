import { Languages } from 'lucide-react'
import { usePortfolio } from '@/app/providers/portfolio'
import { locales } from '@/i18n'
import { Button, icon } from '@/design-system'

/** Two options stay segmented: a dropdown would hide half the answer. */
export function LanguageSelector() {
  const { locale, setLocale, t } = usePortfolio()
  return (
    <div
      role="group"
      aria-label={t.language.label}
      className="inline-flex items-center gap-0.5 rounded-control border border-line pl-2 text-ink-faint"
    >
      <Languages {...icon} />
      {locales.map((value) => (
        <Button
          key={value}
          variant="toggle"
          active={locale === value}
          onClick={() => setLocale(value)}
        >
          {value}
        </Button>
      ))}
    </div>
  )
}
