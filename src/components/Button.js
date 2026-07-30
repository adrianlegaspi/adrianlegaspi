import React from 'react';

/**
 * Win9x push button. The bevel comes from the shared `.btn-retro` /
 * `.bevel-*` system rather than the rgba() shadows this used to fake —
 * those were tuned for a dark surface and were nearly invisible against
 * the cream panel face.
 */
const Button = ({
  children,
  onClick,
  className = '',
  type = 'button',
  variant = 'outline',
  ...props
}) => {
  const variants = {
    // Standard raised button
    outline: 'btn-retro',
    // Default/affirmative button: raised, but with the heavy outer ring
    // Win9x used to mark the dialog's default action.
    solid: 'btn-retro ring-1 ring-ink',
  };

  const variantClasses = variants[variant] || variants.outline;

  return (
    <button
      type={type}
      onClick={onClick}
      className={`font-chrome ${variantClasses} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
