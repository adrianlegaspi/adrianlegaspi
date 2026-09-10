import type { AnchorHTMLAttributes } from 'react'
import { control, cx, type ControlVariant } from './styles'

type ActionLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: ControlVariant
  href: string
}

/** An `<a>` wearing a control. Links that leave the app open in a new tab safely. */
export function ActionLink({ variant = 'outline', className, href, ...props }: ActionLinkProps) {
  // A PDF is an asset, not a route: opening it in place would tear down the city.
  const leavesApp = href.startsWith('http') || href.endsWith('.pdf')
  return (
    <a
      href={href}
      className={cx(control(variant), className)}
      {...(leavesApp ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
      {...props}
    />
  )
}
