import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

function Hero() {
  const t = useTranslations('hero');
  const [displayText, setDisplayText] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const greeting = t('greeting');

  useEffect(() => {
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= greeting.length) {
        setDisplayText(greeting.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        setIsTypingComplete(true);
      }
    }, 100);

    return () => clearInterval(typingInterval);
  }, [greeting]);

  const handleScroll = () => {
    const about = document.getElementById('about');
    if (about) {
      about.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="hero" className="min-h-screen flex flex-col justify-center items-center text-center gap-6 px-4 relative overflow-hidden">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 40px, currentColor 40px, currentColor 41px),
                           repeating-linear-gradient(90deg, transparent, transparent 40px, currentColor 40px, currentColor 41px)`
        }}></div>
      </div>

      {/* ASCII art decoration */}
      <div className="absolute top-10 left-10 text-xs opacity-20 font-mono hidden lg:block">
        {'╔══════════╗'}<br/>
        {'║ PORTFOLIO ║'}<br/>
        {'╚══════════╝'}
      </div>
      
      <div className="absolute bottom-10 right-10 text-xs opacity-20 font-mono hidden lg:block">
        {'┌─────────┐'}<br/>
        {'│ v1.0.0  │'}<br/>
        {'└─────────┘'}
      </div>

      <div className="relative z-10">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-2">
          <span className="inline-block">
            {displayText}
            <span className={`${isTypingComplete ? 'cursor-blink' : ''} text-current`}>_</span>
          </span>
        </h1>
        
        {isTypingComplete && (
          <>
            <p className="text-xl md:text-2xl animate-slide-up opacity-0" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
              {t('subtitle')}
            </p>
            
            {/* Retro style decorative elements */}
            <div className="flex justify-center gap-4 mt-8 animate-slide-up opacity-0" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
              <span className="text-sm text-comment">[</span>
              <span className="text-sm uppercase tracking-widest">Creative Developer</span>
              <span className="text-sm text-comment">]</span>
            </div>
          </>
        )}
      </div>

      {isTypingComplete && (
        <button
          type="button"
          className="mt-10 animate-bounce p-2 border-2 border-current btn-retro shadow-ink"
          aria-label={t('cta')}
          onClick={handleScroll}
          style={{ animationDelay: '0.9s' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      )}

      {/* Scanline effect overlay */}
      <div className="scanlines absolute inset-0 pointer-events-none"></div>
    </section>
  );
}

export default Hero;
