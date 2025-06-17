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
      className="
        p-1 w-[26px] h-[26px] flex items-center justify-center 
        border border-ink dark:border-paper
        bg-paper dark:bg-ink
        active:shadow-[inset_1px_1px_1px_rgba(0,0,0,0.7)]
        active:translate-y-[1px] active:translate-x-[1px]
        transition-none
        text-[11px] font-mono
      "
    >
      {locale === 'en' ? 'EN' : 'ES'}
    </button>
  );
}

export default LangSwitcher;
