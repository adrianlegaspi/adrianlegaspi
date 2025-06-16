import React from 'react';
import { useTranslations } from 'next-intl';

function About() {
  const t = useTranslations('about');
  return (
    <section id="about" className="prose dark:prose-invert mx-auto px-4 max-w-3xl card">
      <h2>{t('heading')}</h2>
      <p>{t('bio')}</p>
    </section>
  );
}

export default About;
