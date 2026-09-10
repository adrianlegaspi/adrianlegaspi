import {
  Apple,
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
import { profile } from '@/data/profile'
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
  resume: FileText,
}

export function ProjectLinks({ content }: { content: PanelContent }) {
  const { t } = usePortfolio()
  // The construction site is the end-of-experience call to action (spec §10).
  const contact = content.id === 'next-project'
  const links: PanelContent['links'] = contact
    ? [
        { kind: 'email', label: t.contact.email, href: `mailto:${profile.email}` },
        { kind: 'linkedin', label: t.contact.linkedin, href: profile.linkedin },
        { kind: 'github', label: t.contact.github, href: profile.github },
        { kind: 'resume', label: t.contact.resume, href: profile.resume },
      ]
    : content.links

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
