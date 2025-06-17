import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

function About() {
  const t = useTranslations('about');
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Intersection Observer to trigger animation when section is in view
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
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
      <div className="absolute -left-2 top-0 text-xs opacity-20 font-mono hidden md:block pt-2">
        {'> ABOUT'}<br/>
      </div>
      
      <div className={`card relative overflow-hidden transition-all duration-500 ${isVisible ? 'opacity-100' : 'opacity-0 translate-y-8'}`}>
        {/* Retro header with underline */}
        <h2 className="text-3xl font-bold mb-6 relative inline-flex items-center">
          <span className="mr-3 opacity-40">//</span>
          {t('heading')}
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
