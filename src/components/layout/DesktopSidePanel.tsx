import { X } from 'lucide-react'
import { usePortfolio } from '@/app/providers/portfolio'
import type { PanelContent } from '@/app/panelContent'
import { ProjectPanel } from '@/components/project/ProjectPanel'
import { ProjectLinks } from '@/components/project/ProjectLinks'
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
        'flex flex-col overflow-hidden border-l focus-visible:outline-none',
        surface.panel,
        !reducedMotion && 'transition-transform duration-300 ease-out',
        content ? 'translate-x-0' : 'pointer-events-none translate-x-full',
      )}
    >
      {content && (
        <>
          <div className="flex shrink-0 px-6 pt-20 pb-4">
            <Button variant="outline" className="ml-auto gap-1.5 px-2.5 py-0" onClick={onClose}>
              <X {...icon} />
              {t.panel.close}
            </Button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 pb-6">
            <ProjectPanel content={content} />
          </div>
          {content.links.length > 0 && (
            <footer className="shrink-0 border-t border-line px-6 py-4">
              <ProjectLinks content={content} />
            </footer>
          )}
        </>
      )}
    </aside>
  )
}
