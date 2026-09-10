import { useState } from 'react'
import { MousePointerClick, X } from 'lucide-react'
import { usePortfolio } from '@/app/providers/portfolio'
import { Button, cx, icon, surface } from '@/design-system'

const STORAGE_KEY = 'legaspi.hint-dismissed'

const wasDismissed = () => {
  try {
    return localStorage.getItem(STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

/** Small, dismissible, and never the only way to learn anything (spec §44). */
export function CityHint({ hidden }: { hidden: boolean }) {
  const { t } = usePortfolio()
  const [dismissed, setDismissed] = useState(wasDismissed)

  if (dismissed || hidden) return null

  return (
    <p
      className={cx(
        'pointer-events-auto absolute inset-x-4 bottom-4 z-10 mx-auto flex max-w-md items-center',
        'gap-2 py-2 pr-2 pl-4 text-sm text-ink-muted sm:inset-x-auto sm:left-6',
        surface.pill,
      )}
    >
      <MousePointerClick {...icon} className="shrink-0 text-ink-faint" />
      <span>{t.city.hint}</span>
      <Button
        variant="icon"
        className="ml-auto rounded-full"
        onClick={() => {
          setDismissed(true)
          try {
            localStorage.setItem(STORAGE_KEY, '1')
          } catch {
            // Nothing to do: the hint simply comes back next visit.
          }
        }}
      >
        <X {...icon} />
        <span className="sr-only">{t.city.dismissHint}</span>
      </Button>
    </p>
  )
}
