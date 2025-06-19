import React from 'react';
import { useTheme } from 'next-themes';

function ThemeToggle() {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const { theme, setTheme } = useTheme();
  const toggle = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };
  if (!mounted) {
    return null; // avoid SSR mismatch
  }
  return (
    <button 
      type="button" 
      className="
        p-1 w-[30px] h-[30px] flex items-center justify-center 
        border border-ink dark:border-paper
        bg-paper dark:bg-ink
        active:shadow-[inset_1px_1px_1px_rgba(0,0,0,0.7)]
        active:translate-y-[1px] active:translate-x-[1px]
        transition-none
      " 
      onClick={toggle} 
      aria-label="Toggle theme"
    >
      <i className={`hn text-lg ${theme === 'light' ? 'hn-sun' : 'hn-moon'}`} />
    </button>
  );
}

export default ThemeToggle;
