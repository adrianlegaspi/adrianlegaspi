import React, { useState } from 'react';

import { useTranslations } from 'next-intl';
import Button from './Button';
import { SOCIAL_LINKS } from '../constants/social';

function Contact() {
  const t = useTranslations('contact');
  const [copied, setCopied] = useState(false);
  const email = SOCIAL_LINKS.email;

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
  };

  const handleSocialClick = (url) => {
    window.open(url, '_blank');
  };

  return (
    <section id="contact" className="py-16 px-4 relative">
      {/* Background effect */}
      <div 
        className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none"
        style={{ backgroundSize: '20px 20px' }}
      ></div>
      
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h2 className="text-4xl font-bold tracking-tight text-ink dark:text-paper sm:text-5xl">
          {t('title')}
        </h2>
        <p className="mt-4 text-lg text-light-ink dark:text-dark-ink">
          {t('description')}
        </p>
        <p className="mb-4">
          {t('intro')}
        </p>
      </div>
      
      {/* Windowed App Component */}
      <div className="bg-paper dark:bg-ink border-2 border-ink dark:border-paper rounded-lg shadow-lg max-w-2xl mx-auto font-mono text-sm text-ink dark:text-paper overflow-hidden">
        {/* Title Bar */}
        <div className="flex items-center justify-between bg-ink dark:bg-paper px-4 py-2 border-b-2 border-ink dark:border-paper">
          <div className="flex space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500"></span>
            <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
            <span className="w-3 h-3 rounded-full bg-green-500"></span>
          </div>
          <div className="font-bold text-paper dark:text-ink"></div>
          <div className="w-12"></div>
        </div>

        {/* Window Content */}
        <div className="p-6">
          <div className="mb-6">
            <p className="mb-2">{t('intro_text')}</p>
            <div className="flex items-center gap-4 bg-light-paper dark:bg-dark-paper p-3 rounded-md pl-0">
              <span className="text-green-600 dark:text-green-400">{t('email_label')}</span>
              <a href={`mailto:${email}`} className="hover:underline">{email}</a>
              <Button
                onClick={handleCopyEmail}
                variant="solid"
                className="ml-auto px-3 py-1 text-xs"
              >
                {copied ? t('copy_button_copied') : t('copy_button')}
              </Button>
            </div>
          </div>

          <div>
            <p className="mb-4 text-center">{t('find_me_on')}</p>
            <div className="flex items-center justify-center gap-6">
              {Object.entries(SOCIAL_LINKS).map(([key, value]) => {
                if (key !== 'email') {
                  return (
                    <a
                      key={key}
                      href={value}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-ink dark:text-paper p-2 border-2 border-transparent rounded-md hover:border-ink dark:hover:border-paper transition-all"
                      aria-label={`Visit my ${key} profile`}
                    >
                      <i className={`hn hn-${key} text-3xl`}></i>
                    </a>
                  );
                }
                return null;
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-ink dark:bg-paper px-4 py-2 border-t-2 border-ink dark:border-paper text-right">
          <span className="text-xs text-paper dark:text-ink opacity-50">{t('session_status')}</span>
        </div>
      </div>

      <div className="scanlines absolute inset-0 opacity-10 pointer-events-none"></div>
    </section>
  );
}

export default Contact;
