import Markdown from 'react-markdown'
import { link } from './styles'

/**
 * Case study body copy. Markdown renders as plain semantic HTML — crawlable,
 * no canvas — with one type scale shared by the panel and the no-WebGL page.
 */
const components = {
  h1: (props: object) => <h3 className="mt-6 text-lg font-semibold text-ink" {...props} />,
  h2: (props: object) => <h3 className="mt-6 text-base font-semibold text-ink" {...props} />,
  h3: (props: object) => (
    <h4 className="mt-5 text-sm font-semibold tracking-wide text-ink-subtle uppercase" {...props} />
  ),
  p: (props: object) => <p className="mt-3 text-sm leading-relaxed text-ink-muted" {...props} />,
  ul: (props: object) => (
    <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-relaxed text-ink-muted" {...props} />
  ),
  ol: (props: object) => (
    <ol
      className="mt-3 list-decimal space-y-1 pl-5 text-sm leading-relaxed text-ink-muted"
      {...props}
    />
  ),
  strong: (props: object) => <strong className="font-semibold text-ink" {...props} />,
  a: (props: object) => <a className={link} rel="noreferrer noopener" {...props} />,
  hr: () => <hr className="mt-6 border-line" />,
}

export function Prose({ children }: { children: string }) {
  return <Markdown components={components}>{children}</Markdown>
}
