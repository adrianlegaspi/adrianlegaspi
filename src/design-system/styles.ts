/**
 * Shared class recipes. Exported as functions rather than components so that
 * react-router `<Link>`, `<a>` and `<button>` can all wear the same control
 * without a wrapper for each element type.
 */
export const cx = (...parts: (string | false | null | undefined)[]) =>
  parts.filter(Boolean).join(' ')

export const focusRing =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-ring'

/** Comfortable touch target for anything tappable (spec §29). */
const TAP = 'min-h-11'

/**
 * One icon geometry for the whole UI: same size, same stroke, always
 * decorative: the label next to it carries the meaning (spec §21).
 */
export const icon = { size: 16, strokeWidth: 1.75, 'aria-hidden': true } as const

export type ControlVariant = 'nav' | 'outline' | 'toggle' | 'icon' | 'select'

const controlVariants: Record<ControlVariant, string> = {
  nav: `${TAP} px-2.5 text-sm font-medium text-ink-muted hover:text-ink`,
  outline: `${TAP} border border-line px-3 py-2 text-sm font-medium text-ink-muted hover:border-line-strong hover:bg-surface-hover`,
  toggle: `${TAP} min-w-11 px-2.5 text-xs font-semibold uppercase text-ink-subtle hover:text-ink`,
  icon: `${TAP} min-w-11 text-ink-faint hover:text-ink`,
  select: `${TAP} border border-line px-2.5 text-sm font-medium text-ink-muted hover:border-line-strong hover:bg-surface-hover`,
}

/** `active` is the selected state of a toggle or the current route of a link. */
export function control(variant: ControlVariant, active = false) {
  return cx(
    'inline-flex items-center justify-center rounded-control transition',
    focusRing,
    controlVariants[variant],
    active && (variant === 'toggle' ? 'bg-selected text-selected-ink' : 'text-ink'),
  )
}

/**
 * A row inside `Menu`, minus its layout so a row can be one line or two.
 * Selection reads from `aria-current` / `aria-checked`.
 */
export const menuItem = cx(
  'w-full rounded-control px-2.5 py-1.5 text-left text-sm text-ink-muted',
  'hover:bg-surface-hover aria-[checked=true]:bg-surface-sunk aria-[current=page]:bg-surface-sunk',
  'aria-[checked=true]:text-ink aria-[current=page]:font-semibold',
  focusRing,
)

export type SurfaceVariant = 'panel' | 'bar' | 'pill' | 'menu' | 'sheet'

/** Floating surfaces over the city: translucent, blurred, barely outlined. */
export const surface: Record<SurfaceVariant, string> = {
  panel: 'border-line-veil bg-surface backdrop-blur',
  bar: 'border-line-veil bg-surface-veil backdrop-blur',
  pill: 'rounded-full bg-surface-veil shadow-sm backdrop-blur',
  menu: 'rounded-panel border border-line bg-surface p-1.5 shadow-lg backdrop-blur',
  sheet:
    'rounded-t-2xl border-t border-line-veil bg-surface shadow-[0_-4px_24px_rgba(46,30,12,0.14)] backdrop-blur',
}

export const link = cx('text-accent underline underline-offset-2', focusRing)
