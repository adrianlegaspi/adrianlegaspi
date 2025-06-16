import React from 'react';
import { useRouter } from 'next/router';

function LangSwitcher() {
  const router = useRouter();
  const { locale, pathname, query, asPath } = router;

  const toggleLocale = () => {
    const nextLocale = locale === 'en' ? 'es' : 'en';
    router.push({ pathname, query }, asPath, { locale: nextLocale });
  };

  return (
    <button type="button" onClick={toggleLocale} aria-label="Toggle language">
      {locale.toUpperCase()}
    </button>
  );
}

export default LangSwitcher;
