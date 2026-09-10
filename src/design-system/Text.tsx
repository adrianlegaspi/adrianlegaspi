import type { ReactNode } from 'react'
import { cx } from './styles'

const tones = {
  eyebrow: 'text-xs font-medium tracking-wide text-ink-subtle uppercase',
  title: 'text-2xl leading-tight font-semibold text-ink',
  heading: 'text-base font-semibold text-ink',
  label: 'text-xs font-medium tracking-wide text-ink-faint uppercase',
  body: 'text-sm leading-relaxed text-ink-muted',
  meta: 'text-sm text-ink-muted',
}

export type TextTone = keyof typeof tones

/** The type scale. Anything with words uses one of these tones. */
export function Text({
  as: Tag = 'p',
  tone = 'body',
  className,
  children,
}: {
  as?: 'p' | 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'div'
  tone?: TextTone
  className?: string
  children: ReactNode
}) {
  return <Tag className={cx(tones[tone], className)}>{children}</Tag>
}

export const textTone = (tone: TextTone) => tones[tone]
