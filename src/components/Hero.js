import React from 'react';
import { useTranslations } from 'next-intl';

function Hero() {
  const t = useTranslations('hero');

  const handleScroll = () => {
    const about = document.getElementById('about');
    if (about) {
      about.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="hero" className="min-h-screen flex flex-col justify-center items-center text-center gap-6">
      <h1 className="text-4xl md:text-6xl font-bold animate-pop">{t('greeting')}</h1>
      <p className="text-xl md:text-2xl">{t('subtitle')}</p>
      <button
        type="button"
        className="mt-10 animate-bounce"
        aria-label={t('cta')}
        onClick={handleScroll}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </section>
  );
}

export default Hero;
