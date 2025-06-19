import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
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
        <p className="mt-6 text-xl text-ink dark:text-paper">
          {t('available_freelance')}
        </p>
      </div>
      
      {/* Terminal Window Component */}
      <div className="bg-paper dark:bg-black border border-ink dark:border-paper shadow-ink dark:shadow-paper max-w-lg mx-auto overflow-hidden">
        {/* Title Bar */}
        <div className="flex items-center px-4 py-2 bg-ink dark:bg-black">
          <div className="flex space-x-2">
            <span className="w-3 h-3 bg-red-500"></span>
            <span className="w-3 h-3 bg-yellow-500"></span>
            <span className="w-3 h-3 bg-green-500"></span>
          </div>
        </div>

        {/* Window Content */}
        <div className="p-8 font-mono bg-paper dark:bg-black text-ink dark:text-paper">
          <div className="mb-8">
            <div className="flex flex-col items-center justify-center text-center gap-2">
              <span className="text-green-500 dark:text-green-400 font-bold">{t('email_label')}</span>
              <div className="flex items-center gap-2">
                <a 
                  href={`mailto:${email}`} 
                  className="text-ink dark:text-paper hover:underline"
                  onClick={() => handleCopyEmail()}
                >
                  {email}
                </a>
                {copied && <span className="text-xs text-green-500 dark:text-green-400 opacity-75">{t('copied')}</span>}
              </div>
            </div>
          </div>

          <div className="flex justify-center items-center gap-8 mt-12">
            {Object.entries(SOCIAL_LINKS).map(([key, value]) => {
              if (key !== 'email') {
                return (
                  <a
                    key={key}
                    href={value}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ink dark:text-paper hover:opacity-70 transition-colors"
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

      <div className="scanlines absolute inset-0 opacity-10 pointer-events-none"></div>
    </section>
  );
}

export default Contact;
