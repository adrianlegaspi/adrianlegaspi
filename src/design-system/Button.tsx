import type { ButtonHTMLAttributes, Ref } from 'react'
import { control, cx, type ControlVariant } from './styles'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ControlVariant
  /** Selected toggle or current item. Also sets `aria-pressed` for toggles. */
  active?: boolean
  ref?: Ref<HTMLButtonElement>
}

export function Button({
  variant = 'nav',
  active = false,
  className,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      aria-pressed={variant === 'toggle' ? active : undefined}
      className={cx(control(variant, active), className)}
      {...props}
    />
  )
}
