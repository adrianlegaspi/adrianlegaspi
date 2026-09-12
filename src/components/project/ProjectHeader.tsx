import { usePortfolio } from '@/app/providers/portfolio'
import type { PanelContent } from '@/app/panelContent'
import { Tag, Text, textTone } from '@/design-system'

export function ProjectHeader({ content }: { content: PanelContent }) {
  const { t } = usePortfolio()
  return (
    <header className="space-y-2">
      <Text tone="eyebrow" className="flex flex-wrap items-center gap-2">
        <span>{content.eyebrow}</span>
        {content.confidential && (
          <span className="normal-case">
            <Tag variant="badge">{t.confidential.badge}</Tag>
          </span>
        )}
      </Text>
      <div className="flex items-center gap-3">
        {content.icon && (
          <img
            src={content.icon}
            alt=""
            className="h-10 w-10 shrink-0 rounded-control border border-line object-cover"
          />
        )}
        <Text as="h2" tone="title">
          {content.title}
        </Text>
      </div>
      <dl className={`flex flex-wrap gap-x-6 gap-y-1 ${textTone('meta')}`}>
        {content.role && (
          <div className="flex gap-1">
            <dt className="text-ink-faint">{t.panel.role}:</dt>
            <dd>{content.role}</dd>
          </div>
        )}
        {content.dates && (
          <div className="flex gap-1">
            <dt className="text-ink-faint">{t.panel.dates}:</dt>
            <dd>{content.dates}</dd>
          </div>
        )}
      </dl>
    </header>
  )
}
