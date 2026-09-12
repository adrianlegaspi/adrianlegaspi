import {
  Apple,
  AtSign,
  FileText,
  GitBranch,
  Globe,
  Contact,
  Mail,
  MonitorPlay,
  Play,
  type LucideIcon,
} from 'lucide-react'
import { usePortfolio } from '@/app/providers/portfolio'
import type { LinkKind, PanelContent } from '@/app/panelContent'
import { ActionLink, icon } from '@/design-system'

const icons: Record<LinkKind, LucideIcon> = {
  website: Globe,
  appStore: Apple,
  playStore: Play,
  github: GitBranch,
  demo: MonitorPlay,
  email: Mail,
  linkedin: Contact,
  // lucide's `X` is the close cross, so the handle reads better as an at-sign.
  x: AtSign,
  cv: FileText,
}

export function ProjectLinks({ content }: { content: PanelContent }) {
  const { t } = usePortfolio()
  const links = content.links

  if (!links.length) return null

  return (
    <nav aria-label={t.panel.links} className="flex flex-wrap gap-2">
      {links.map((item) => {
        const Icon = icons[item.kind]
        return (
          <ActionLink key={item.href} href={item.href} className="gap-1.5">
            <Icon {...icon} />
            {item.label}
          </ActionLink>
        )
      })}
    </nav>
  )
}
