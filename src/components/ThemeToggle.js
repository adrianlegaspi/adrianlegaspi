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
    <button type="button" className="flex items-center" onClick={toggle} aria-label="Toggle theme">
      <i className={`hn ${theme === 'light' ? 'hn-sun' : 'hn-moon'}`} />
    </button>
  );
}

export default ThemeToggle;
