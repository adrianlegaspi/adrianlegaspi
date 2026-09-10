import type { AnchorHTMLAttributes } from 'react'
import { control, cx, type ControlVariant } from './styles'

type ActionLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: ControlVariant
  href: string
}

/** An `<a>` wearing a control. External links open in a new tab safely. */
export function ActionLink({ variant = 'outline', className, href, ...props }: ActionLinkProps) {
  const external = href.startsWith('http')
  return (
    <a
      href={href}
      className={cx(control(variant), className)}
      {...(external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
      {...props}
    />
  )
}
