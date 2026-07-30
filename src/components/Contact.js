import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { SOCIAL_LINKS } from '../constants/social';
import Window from './Window';

function Contact() {
  const t = useTranslations('contact');
  const tUi = useTranslations('ui');
  const [copied, setCopied] = useState(false);
  const email = SOCIAL_LINKS.email;

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="contact" className="py-16 px-4 relative">
      {/* Desktop dither, replacing the undefined `bg-grid-pattern` class */}
      <div
        className="desktop-dither absolute inset-0 pointer-events-none text-ink opacity-[0.06]"
        aria-hidden="true"
      />

      <div className="max-w-3xl mx-auto text-center mb-12 relative">
        <h2 className="text-4xl font-bold tracking-tight text-ink sm:text-5xl">
          {t('title')}
        </h2>
        <p className="mt-6 text-xl text-ink">{t('available_freelance')}</p>
      </div>

      {/* A dialog box, in the same OS dialect as the taskbar. The previous
          red/yellow/green dots were macOS chrome and contradicted it. */}
      <Window
        title={t('window_title')}
        icon="hn-envelope"
        status={[copied ? t('copied') : tUi('ready')]}
        className="max-w-lg mx-auto relative"
        bodyClassName="p-6"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="font-chrome text-chrome-text self-start text-xs">
            {t('email_label')}
          </span>

          {/* Sunken read-only field + push button, the era-correct pairing */}
          <div className="flex w-full items-stretch gap-2">
            <div className="bevel-sunken flex flex-1 items-center bg-desktop px-2 py-1.5">
              <a
                href={`mailto:${email}`}
                className="font-mono text-sm text-ink hover:underline"
              >
                {email}
              </a>
            </div>

            <button
              type="button"
              onClick={handleCopyEmail}
              className="btn-retro px-3 text-xs"
            >
              {copied ? t('copy_button_copied') : t('copy_button')}
            </button>
          </div>
        </div>

        <div className="bevel-groove my-6" />

        <p className="font-chrome text-chrome-text mb-4 text-center text-xs">
          {t('find_me_on')}
        </p>

        <div className="flex justify-center items-center gap-3">
          {Object.entries(SOCIAL_LINKS).map(([key, value]) => {
            if (key === 'email') return null;
            return (
              <a
                key={key}
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-retro h-11 w-11"
                aria-label={`Visit my ${key} profile`}
              >
                <i className={`hn hn-${key} text-xl`} aria-hidden="true" />
              </a>
            );
          })}
        </div>
      </Window>

      {/* CRT scanlines */}
      <div className="scanlines absolute inset-0 opacity-10 pointer-events-none"></div>
    </section>
  );
}

export default Contact;
