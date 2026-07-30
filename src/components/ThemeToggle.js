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
      className="btn-retro h-[26px] w-[26px]"
      onClick={toggle}
      aria-label="Toggle theme"
    >
      <i
        className={`hn text-base ${theme === 'light' ? 'hn-sun' : 'hn-moon'}`}
        aria-hidden="true"
      />
    </button>
  );
}

export default ThemeToggle;
