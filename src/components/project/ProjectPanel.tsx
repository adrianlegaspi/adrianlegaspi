import { usePortfolio } from '@/app/providers/portfolio'
import type { PanelContent } from '@/app/panelContent'
import { Notice, Prose, Tag, Text } from '@/design-system'
import { ConfidentialProjectNotice } from './ConfidentialProjectNotice'
import { ProjectHeader } from './ProjectHeader'
import { ProjectLinks } from './ProjectLinks'

export function ProjectPanel({ content }: { content: PanelContent }) {
  const { t } = usePortfolio()

  return (
    <article className="space-y-4">
      <ProjectHeader content={content} />
      {content.summary && <Text>{content.summary}</Text>}
      {content.confidential && <ConfidentialProjectNotice />}

      {content.technologies.length > 0 && (
        <section>
          <Text as="h3" tone="label">
            {t.panel.technologies}
          </Text>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {content.technologies.map((tech) => (
              <li key={tech}>
                <Tag>{tech}</Tag>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div>
        <Prose>{content.body}</Prose>
      </div>

      <ProjectLinks content={content} />

      {import.meta.env.DEV && content.placeholder && (
        <Notice variant="flag">
          Placeholder copy — confirm wording, dates and links before publishing.
        </Notice>
      )}
    </article>
  )
}
