import { Check, Moon, Sun, SunMoon, Sunrise, Sunset, type LucideIcon } from 'lucide-react'
import { usePortfolio } from '@/app/providers/portfolio'
import { timeModes, type TimeMode, type TimeTheme } from '@/city/environment/timeOfDay'
import { cx, icon, Menu, menuItem } from '@/design-system'

const icons: Record<TimeMode | TimeTheme, LucideIcon> = {
  auto: SunMoon,
  dawn: Sunrise,
  day: Sun,
  sunset: Sunset,
  night: Moon,
}

/**
 * One control, not four (spec §22). `auto` also shows the look it currently
 * resolves to, so the visitor can tell the clock from the choice.
 */
export function TimeThemeSelector() {
  const { timeMode, setTimeMode, theme, t, layout } = usePortfolio()
  const Current = icons[timeMode === 'auto' ? theme : timeMode]

  return (
    <Menu
      variant="select"
      width="w-44"
      ariaLabel={t.time.label}
      label={
        <>
          <Current {...icon} />
          {/* Mobile header space is scarce: the icon and the aria-label carry it. */}
          {layout === 'desktop' && (
            <>
              <span>{t.time[timeMode]}</span>
              {timeMode === 'auto' && (
                <span className="text-xs text-ink-faint">{t.time[theme]}</span>
              )}
            </>
          )}
        </>
      }
    >
      {(close) => (
        <ul>
          {timeModes.map((mode) => {
            const Icon = icons[mode]
            const selected = mode === timeMode
            return (
              <li key={mode}>
                <button
                  type="button"
                  role="menuitemradio"
                  aria-checked={selected}
                  onClick={() => {
                    setTimeMode(mode)
                    close()
                  }}
                  className={cx(menuItem, 'flex min-h-11 items-center gap-2.5')}
                >
                  <Icon {...icon} />
                  <span>{t.time[mode]}</span>
                  {selected && <Check {...icon} className="ml-auto text-accent" />}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </Menu>
  )
}
