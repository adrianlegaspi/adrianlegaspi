import type { ReactNode } from 'react'
import { cx } from './styles'

const variants = {
  /** Technologies. Compact, never a skill bar (spec §21). */
  chip: 'rounded-md bg-surface-sunk px-2 py-1 text-xs font-medium text-ink-muted',
  /** Status next to an eyebrow, such as "Internal project". */
  badge: 'rounded-full bg-surface-sunk px-2 py-0.5 text-[11px] text-ink-muted',
}

export function Tag({
  variant = 'chip',
  children,
}: {
  variant?: keyof typeof variants
  children: ReactNode
}) {
  return <span className={cx('inline-flex items-center', variants[variant])}>{children}</span>
}
