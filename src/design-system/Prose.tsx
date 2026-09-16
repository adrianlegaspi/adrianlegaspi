import Markdown, { type Components } from 'react-markdown'
import { link } from './styles'

/**
 * Case study body copy. Markdown renders as plain semantic HTML. It is crawlable,
 * uses no canvas and shares one type scale with the panel and no-WebGL page.
 */
const components: Components = {
  h1: (props: object) => <h3 className="mt-6 text-lg font-semibold text-ink" {...props} />,
  h2: (props: object) => <h3 className="mt-6 text-base font-semibold text-ink" {...props} />,
  h3: (props: object) => (
    <h4 className="mt-5 text-sm font-semibold tracking-wide text-ink-subtle uppercase" {...props} />
  ),
  p: (props: object) => <p className="mt-3 text-sm leading-relaxed text-ink-muted" {...props} />,
  ul: (props: object) => (
    <ul
      className="mt-3 list-disc space-y-1 pl-5 text-sm leading-relaxed text-ink-muted"
      {...props}
    />
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

const contactComponents: Components = {
  ...components,
  h1: (props) => (
    <h3 className="mt-7 text-xs font-medium tracking-wide text-ink-subtle uppercase" {...props} />
  ),
  h2: (props) => (
    <h3 className="mt-7 text-xs font-medium tracking-wide text-ink-subtle uppercase" {...props} />
  ),
  h3: (props) => (
    <h3 className="mt-7 text-xs font-medium tracking-wide text-ink-subtle uppercase" {...props} />
  ),
  p: (props) => <p className="mt-4 text-base leading-relaxed text-ink-muted" {...props} />,
  ul: (props) => <ul className="mt-4 space-y-3" {...props} />,
  li: ({ children }) => (
    <li className="flex items-start gap-3 text-sm leading-relaxed text-ink-muted">
      <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-[1px] bg-accent" />
      <span>{children}</span>
    </li>
  ),
  strong: (props) => <strong className="font-semibold text-ink" {...props} />,
}

export function Prose({
  children,
  variant = 'default',
}: {
  children: string
  variant?: 'default' | 'contact'
}) {
  return (
    <Markdown components={variant === 'contact' ? contactComponents : components}>
      {children}
    </Markdown>
  )
}
