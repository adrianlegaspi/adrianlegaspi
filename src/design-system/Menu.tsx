import { useEffect, useRef, useState, type ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'
import { Button } from './Button'
import { cx, icon, surface, type ControlVariant } from './styles'

/**
 * The one dropdown in the UI. Dismisses on Escape and on any pointer press
 * outside it, and hands focus back to its trigger. Items belong to the caller,
 * so the same menu holds links or radio options (spec §22).
 */
export function Menu({
  label,
  ariaLabel,
  variant = 'nav',
  active = false,
  width = 'w-64',
  scrollable = false,
  header,
  children,
}: {
  label: ReactNode
  ariaLabel: string
  variant?: ControlVariant
  /** Current route or selected value, so a closed menu still reads as active. */
  active?: boolean
  width?: string
  /** Constrain long menus to the viewport and scroll their item list. */
  scrollable?: boolean
  /** Optional controls that sit outside the menu-item semantics. */
  header?: ReactNode
  children: (close: () => void) => ReactNode
}) {
  const [open, setOpen] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setOpen(false)
      trigger.current?.focus()
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <div ref={root} className="relative">
      <Button
        ref={trigger}
        variant={variant}
        active={active}
        aria-label={ariaLabel}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="gap-1.5"
      >
        {label}
        <ChevronDown {...icon} className={cx('transition-transform', open && 'rotate-180')} />
      </Button>
      {open && (
        <div
          className={cx(
            'absolute right-0 z-30 mt-1 flex max-w-[calc(100vw-2rem)] flex-col',
            scrollable && 'max-h-[60vh]',
            width,
            surface.menu,
          )}
        >
          {header && <div className="mb-1.5 shrink-0 border-b border-line pb-1.5">{header}</div>}
          <div
            role="menu"
            aria-label={ariaLabel}
            className={cx(scrollable && 'min-h-0 overflow-y-auto')}
          >
            {children(() => setOpen(false))}
          </div>
        </div>
      )}
    </div>
  )
}
