import type { ReactNode } from 'react'
import { Lock, TriangleAlert } from 'lucide-react'
import { cx, icon } from './styles'

const variants = {
  /** Stated facts the reader must not miss, such as confidentiality (spec §25). */
  notice: {
    className: 'border-notice-line bg-notice text-sm text-notice-ink',
    Icon: Lock,
  },
  /** DEV-only authoring warnings. Dashed, so it never reads as content. */
  flag: {
    className: 'border-dashed border-flag-line text-xs text-flag-ink',
    Icon: TriangleAlert,
  },
}

export function Notice({
  variant = 'notice',
  children,
}: {
  variant?: keyof typeof variants
  children: ReactNode
}) {
  const { className, Icon } = variants[variant]
  return (
    <p className={cx('flex gap-2 rounded-control border px-3 py-2', className)}>
      <Icon {...icon} className="mt-0.5 shrink-0" />
      <span>{children}</span>
    </p>
  )
}
