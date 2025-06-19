import React from 'react';

const Button = ({ children, onClick, className = '', type = 'button', variant = 'outline', ...props }) => {
  const baseClasses = `
    active:shadow-[inset_1px_1px_1px_rgba(0,0,0,0.7)]
    active:translate-y-[1px] active:translate-x-[1px]
    transition-none
    font-mono
  `;

  const variants = {
    outline: 'bg-paper dark:bg-ink text-ink dark:text-paper border border-ink dark:border-paper',
    solid: 'bg-ink dark:bg-paper text-paper dark:text-ink border border-ink dark:border-paper',
  };

  const variantClasses = variants[variant] || variants.outline;

  const combinedClasses = [
    baseClasses.trim().replace(/\s+/g, ' '),
    variantClasses,
    className
  ].join(' ').trim();

  return (
    <button
      type={type}
      onClick={onClick}
      className={combinedClasses}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
