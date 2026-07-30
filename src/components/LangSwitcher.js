import React from 'react';
import { useRouter } from 'next/router';
import Button from './Button';

function LangSwitcher() {
  const router = useRouter();
  const { locale, pathname, query, asPath } = router;

  const toggleLocale = () => {
    const nextLocale = locale === 'en' ? 'es' : 'en';
    router.push({ pathname, query }, asPath, { locale: nextLocale, scroll: false });
  };

  return (
    <Button
      onClick={toggleLocale}
      aria-label="Toggle language"
      className="h-[26px] w-[26px] text-[10px] font-bold"
    >
      {locale === 'en' ? 'EN' : 'ES'}
    </Button>
  );
}

export default LangSwitcher;
