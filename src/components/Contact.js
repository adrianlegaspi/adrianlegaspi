import React from 'react';
import { useTranslations } from 'next-intl';

function Contact() {
  const t = useTranslations('contact');
  return (
    <section id="contact" className="text-center py-12 bg-ink/5 dark:bg-paper/5">
      <h2 className="text-3xl mb-4">{t('heading')}</h2>
      <p>
        <a href="mailto:contacto@adrianlegaspi.dev" className="underline">
          contacto@adrianlegaspi.dev
        </a>
      </p>
    </section>
  );
}

export default Contact;
