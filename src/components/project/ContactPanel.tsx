import { Construction } from 'lucide-react'
import { usePortfolio } from '@/app/providers/portfolio'
import type { PanelContent } from '@/app/panelContent'
import { Prose, Text } from '@/design-system'

export function ContactPanel({ content }: { content: PanelContent }) {
  const { t } = usePortfolio()

  return (
    <article>
      <header>
        <Text tone="eyebrow">{content.eyebrow}</Text>
        <div className="mt-3 flex items-end justify-between gap-5">
          <Text as="h2" tone="title" className="text-3xl tracking-tight">
            {content.title}
          </Text>
          <Construction size={42} strokeWidth={1.5} aria-hidden className="shrink-0 text-accent" />
        </div>
      </header>

      <section
        aria-label={t.contact.available}
        className="mt-6 border-y border-dashed border-line py-6"
      >
        <Text as="span" tone="label" className="text-ink-subtle">
          {t.contact.available}
        </Text>
        <Text className="mt-5 max-w-sm text-lg leading-relaxed font-medium text-ink">
          {content.summary}
        </Text>
      </section>

      <div className="mt-7">
        <Prose variant="contact">{content.body}</Prose>
      </div>
    </article>
  )
}
