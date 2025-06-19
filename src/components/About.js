import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/router';

function About() {
  const t = useTranslations('about');
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
      {/* Decorative ASCII frame */}
      <div className="text-xs text-comment font-mono hidden lg:block pb-6">
        /* ABOUT */
      </div>
      
      <div className={`card relative overflow-hidden transition-all duration-500 ${isVisible ? 'opacity-100' : 'opacity-0 translate-y-8'}`}>
        {/* Retro header with underline */}
        <h2 className="text-3xl font-bold mb-6 relative inline-flex items-center">
          <span className="mr-3 text-comment">/*</span>
          {t('heading')}
          <span className="ml-3 text-comment">*/</span>
          <span className="absolute bottom-0 left-0 w-full h-1 bg-current opacity-20"></span>
        </h2>
        
        {/* Bio paragraph with enhanced styling */}
        <div className="prose dark:prose-invert">
          <p className="leading-relaxed relative">
            <span className="text-xl opacity-20 absolute -left-4">&ldquo;</span>
            {t('bio')}
            <span className="text-xl opacity-20 absolute -right-4">&rdquo;</span>
          </p>
        </div>
        
        {/* Retro decorative elements */}
        {/* CV Download Section */}
        <div className="mt-8 border-t border-dashed border-ink dark:border-paper pt-5">
          <h3 className="text-xl font-bold mb-3 relative inline-flex items-center">
            <span className="mr-3 text-comment">/*</span>
            {t('downloadCV') || 'Download CV'}
            <span className="ml-3 text-comment">*/</span>
          </h3>
          <div className="flex flex-wrap gap-4">
            <a 
              href="/cv/ADRIAN_LEGASPI_CV_v8_en.pdf" 
              download
              className="btn-retro shadow-ink dark:shadow-paper border-2 border-current px-4 py-2 flex items-center text-sm hover:bg-ink hover:text-paper dark:hover:bg-paper dark:hover:text-ink transition-colors"
            >
              <span className="font-mono mr-2">[ EN ]</span>
              <span>{t('englishCV') || 'English'}</span>
            </a>
            <a 
              href="/cv/ADRIAN_LEGASPI_CV_v8_es.pdf" 
              download
              className="btn-retro shadow-ink dark:shadow-paper border-2 border-current px-4 py-2 flex items-center text-sm hover:bg-ink hover:text-paper dark:hover:bg-paper dark:hover:text-ink transition-colors"
            >
              <span className="font-mono mr-2">[ ES ]</span>
              <span>{t('spanishCV') || 'Spanish'}</span>
            </a>
          </div>
        </div>
        
        <div className="mt-8 flex justify-end">
          <div className="flex gap-2 items-center opacity-40 text-sm">
            <span className="inline-block h-px w-6 bg-current"></span>
            <span>EOF</span>
          </div>
        </div>
      </div>
      
      {/* Grid background */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="h-full w-full opacity-5" 
          style={{
            backgroundImage: 'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}
        ></div>
      </div>
    </section>
  );
}

export default About;
