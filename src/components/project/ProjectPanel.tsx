import { usePortfolio } from '@/app/providers/portfolio'
import type { PanelContent } from '@/app/panelContent'
import { Prose, Tag, Text } from '@/design-system'
import { ConfidentialProjectNotice } from './ConfidentialProjectNotice'
import { ContactPanel } from './ContactPanel'
import { MediaGallery } from './MediaGallery'
import { ProjectHeader } from './ProjectHeader'

export function ProjectPanel({ content }: { content: PanelContent }) {
  const { t } = usePortfolio()

  if (content.id === 'next-project') return <ContactPanel content={content} />

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

      <MediaGallery items={content.media} />
    </article>
  )
}
