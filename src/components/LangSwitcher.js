import React from 'react';
import { useRouter } from 'next/router';
import Button from './Button';

function LangSwitcher() {
  const router = useRouter();
  const { locale, pathname, query, asPath } = router;

  const toggleLocale = () => {
    const nextLocale = locale === 'en' ? 'es' : 'en';
    router.push({ pathname, query }, asPath, { locale: nextLocale });
  };

  return (
    <Button
      onClick={toggleLocale}
      aria-label="Toggle language"
      className="p-1 w-[30px] h-[30px] flex items-center justify-center text-xs"
    >
      {locale === 'en' ? 'EN' : 'ES'}
    </Button>
  );
}

export default LangSwitcher;
