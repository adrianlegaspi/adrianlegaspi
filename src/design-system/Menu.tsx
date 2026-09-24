import { useCallback, useEffect, useRef, useState, type ReactNode, type RefObject } from 'react'
import { ChevronDown } from 'lucide-react'
import { Button } from './Button'
import { cx, icon, surface, type ControlVariant } from './styles'

/**
 * Closes a popover on Escape (focus back to its trigger) and on any pointer
 * press outside `root`.
 */
export function useDismiss(
  open: boolean,
  close: () => void,
  root: RefObject<HTMLElement | null>,
  trigger: RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) close()
    }
    const onKeyDown = (event: KeyboardEvent) => {
      // Nested popovers (a menu inside the mobile drawer): the outer one claims
      // Escape, closes everything and keeps focus on a trigger that survives.
      if (event.key !== 'Escape' || event.defaultPrevented) return
      event.preventDefault()
      close()
      trigger.current?.focus()
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open, close, root, trigger])
}

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
  inline = false,
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
  /** Expand in place, full width, instead of floating (mobile drawer). */
  inline?: boolean
  /** Optional controls that sit outside the menu-item semantics. */
  header?: ReactNode
  children: (close: () => void) => ReactNode
}) {
  const [open, setOpen] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)

  const close = useCallback(() => setOpen(false), [])
  useDismiss(open, close, root, trigger)

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
        className={cx('gap-1.5', inline && 'w-full justify-start')}
      >
        {label}
        <ChevronDown
          {...icon}
          className={cx('transition-transform', inline && 'ml-auto', open && 'rotate-180')}
        />
      </Button>
      {open && (
        <div
          className={cx(
            'flex flex-col',
            inline
              ? 'ml-4 border-l border-line pl-2'
              : cx(
                  'absolute right-0 z-30 mt-1 max-w-[calc(100vw-2rem)]',
                  scrollable && 'max-h-[60vh]',
                  width,
                  surface.menu,
                ),
          )}
        >
          {header && <div className="mb-1.5 shrink-0 border-b border-line pb-1.5">{header}</div>}
          <div
            role="menu"
            aria-label={ariaLabel}
            className={cx(scrollable && !inline && 'min-h-0 overflow-y-auto')}
          >
            {children(close)}
          </div>
        </div>
      )}
    </div>
  )
}
