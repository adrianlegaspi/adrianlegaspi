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
    <button 
      type="button" 
      onClick={toggleLocale} 
      aria-label="Toggle language"
      className="text-[10px] font-mono flex items-center justify-center"
    >
      {locale === 'en' ? 'EN' : 'ES'}
    </button>
  );
}

export default LangSwitcher;
