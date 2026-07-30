import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/router';
// Written by `npm run generate-cv`, so the download always points at the
// newest versioned PDF without this filename being edited by hand.
import cvVersion from '../constants/cvVersion.json';
import Window from './Window';

function About() {
  const t = useTranslations('about');
  const tUi = useTranslations('ui');
  const router = useRouter();
  const { locale } = router;
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Intersection Observer to trigger animation when section is in view
    // This should ONLY control animation, not scroll position
    // Only animate when visible, don't trigger any scrolling
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Just handle animation, don't affect scrolling
          setIsVisible(true);
          observer.disconnect();
        }
      },
      // Use a small negative rootMargin to prevent accidental triggering
      { threshold: 0.1, rootMargin: '-10px' }
    );
    
    const section = document.getElementById('about');
    if (section) observer.observe(section);
    
    return () => {
      if (section) observer.unobserve(section);
    };
  }, []);

  return (
    <section id="about" className="mx-auto px-4 py-8 max-w-3xl relative">
      {/* The title bar carries the filename, not the section heading: that
          way the real <h2> keeps its full size inside the client area and the
          text isn't duplicated. A document window worked exactly this way. */}
      <Window
        title="about.txt"
        titleClassName="font-mono"
        icon="hn-user"
        status={[
          t('wordCount', { count: t('bio').trim().split(/\s+/).filter(Boolean).length }),
          tUi('oneDocument'),
        ]}
        className={`transition-all duration-500 ${isVisible ? 'opacity-100' : 'opacity-0 translate-y-8'}`}
        bodyClassName="p-6"
      >
        <h2 className="mb-4 text-2xl font-bold tracking-tight">{t('heading')}</h2>

        <p className="leading-relaxed">{t('bio')}</p>

        {/* Etched divider replaces the old dashed rule */}
        <div className="bevel-groove my-6" />

        <h3 className="text-base font-bold mb-3">{t('downloadCV') || 'Download CV'}</h3>

        <div className="flex flex-wrap gap-3">
          <a
            href={`/cv/${cvVersion.pdf}`}
            download
            className="btn-retro px-3 py-2 gap-2 text-sm"
          >
            {/* A file on a disk, not a code token */}
            <i className="hn hn-save text-xs" aria-hidden="true" />
            <span className="font-mono text-xs">{cvVersion.pdf}</span>
            <span className="text-chrome-text">({t('englishCV') || 'English'})</span>
          </a>
        </div>
      </Window>
    </section>
  );
}

export default About;
