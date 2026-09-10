import { useState } from 'react'
import { ChevronsDownUp, ChevronsUpDown, GripHorizontal, X } from 'lucide-react'
import { usePortfolio } from '@/app/providers/portfolio'
import type { PanelContent } from '@/app/panelContent'
import { ProjectPanel } from '@/components/project/ProjectPanel'
import { Button, control, cx, icon, surface } from '@/design-system'
import { usePanel } from './usePanel'

/**
 * Mobile case study: a peek state with the essentials, expanding to the full
 * case study. Scrolls on its own without moving the city (spec §17).
 */
export function MobileBottomSheet({
  content,
  onClose,
}: {
  content: PanelContent | null
  onClose: () => void
}) {
  const { t, reducedMotion } = usePortfolio()
  // Expansion is remembered per project, so opening another one starts at the peek height.
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const ref = usePanel<HTMLElement>(content?.id ?? null, onClose)
  const expanded = Boolean(content) && expandedId === content?.id

  return (
    <aside
      ref={ref}
      tabIndex={-1}
      aria-label={content?.title ?? t.nav.projects}
      aria-hidden={!content}
      className={cx(
        'pointer-events-auto absolute inset-x-0 bottom-0 z-20 flex flex-col overflow-hidden',
        surface.sheet,
        !reducedMotion && 'transition-transform duration-300 ease-out',
        content ? 'translate-y-0' : 'pointer-events-none translate-y-full',
        expanded ? 'max-h-[85vh]' : 'max-h-[42vh]',
      )}
    >
      {content && (
        <>
          <div className="flex items-center gap-2 px-4 pt-3">
            <button
              type="button"
              onClick={() => setExpandedId(expanded ? null : (content?.id ?? null))}
              aria-expanded={expanded}
              className={cx(control('nav'), 'flex-1 justify-start gap-3 px-0 text-left')}
            >
              {/* The panel below already carries the title, so the handle stays bare. */}
              <GripHorizontal {...icon} className="text-ink-faint" />
              <span className="sr-only">{content.title}</span>
              <span className="ml-auto flex items-center gap-1.5 text-xs font-medium text-ink-subtle">
                {expanded ? <ChevronsDownUp {...icon} /> : <ChevronsUpDown {...icon} />}
                {expanded ? t.panel.collapse : t.panel.expand}
              </span>
            </button>
            <Button variant="icon" onClick={onClose}>
              <X {...icon} />
              <span className="sr-only">{t.panel.close}</span>
            </Button>
          </div>
          <div className="touch-pan-y overflow-y-auto overscroll-contain px-4 pt-2 pb-6">
            <ProjectPanel content={content} />
          </div>
        </>
      )}
    </aside>
  )
}
