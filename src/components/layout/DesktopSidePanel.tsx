import { X } from 'lucide-react'
import { usePortfolio } from '@/app/providers/portfolio'
import type { PanelContent } from '@/app/panelContent'
import { ProjectPanel } from '@/components/project/ProjectPanel'
import { Button, cx, icon, surface } from '@/design-system'
import { usePanel } from './usePanel'

export function DesktopSidePanel({
  content,
  onClose,
}: {
  content: PanelContent | null
  onClose: () => void
}) {
  const { t, reducedMotion } = usePortfolio()
  const ref = usePanel<HTMLElement>(content?.id ?? null, onClose)

  return (
    <aside
      ref={ref}
      tabIndex={-1}
      aria-label={content?.title ?? t.nav.projects}
      aria-hidden={!content}
      className={cx(
        'pointer-events-auto absolute top-0 right-0 bottom-0 z-20 w-[min(30vw,460px)] min-w-[360px]',
        // The header floats above the panel, so the content starts below it.
        'overflow-y-auto overscroll-contain border-l px-6 pt-20 pb-6 focus-visible:outline-none',
        surface.panel,
        !reducedMotion && 'transition-transform duration-300 ease-out',
        content ? 'translate-x-0' : 'pointer-events-none translate-x-full',
      )}
    >
      {content && (
        <>
          <div className="mb-4 flex">
            <Button variant="outline" className="ml-auto gap-1.5 px-2.5 py-0" onClick={onClose}>
              <X {...icon} />
              {t.panel.close}
            </Button>
          </div>
          <ProjectPanel content={content} />
        </>
      )}
    </aside>
  )
}
