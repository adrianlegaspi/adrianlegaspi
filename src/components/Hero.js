import React, { useEffect, useState, useRef } from 'react';
import { useTranslations } from 'next-intl';

// Store animation state globally to persist across language changes
const hasAnimationPlayed = typeof window !== 'undefined' ? 
  window.hasHeroAnimationPlayed || false : false;

function Hero() {
  const t = useTranslations('hero');
  const greeting = t('greeting');
  const subtitle = t('subtitle');
  
  // States for animation control
  const [displayText, setDisplayText] = useState(hasAnimationPlayed ? greeting : '');
  const [isTypingComplete, setIsTypingComplete] = useState(hasAnimationPlayed);
  const [hasAnimated, setHasAnimated] = useState(hasAnimationPlayed);
  
  const heroRef = useRef(null);
  
  // First-time page load scroll prevention
  useEffect(() => {
    // Skip scroll prevention if animation has already played
    if (hasAnimated) return;
    
    // Prevent scrolling during animation
    const html = document.documentElement;
    const body = document.body;
    
    // Save original styles
    const htmlOverflow = html.style.overflow;
    const bodyOverflow = body.style.overflow;
    const bodyPosition = body.style.position;
    
    // Disable scrolling
    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    body.style.position = 'fixed';
    body.style.width = '100%';
    body.style.top = '0';
    
    return () => {
      // Restore original styles
      html.style.overflow = htmlOverflow;
      body.style.overflow = bodyOverflow;
      body.style.position = bodyPosition;
      body.style.width = '';
      body.style.top = '';
    };
  }, [hasAnimated]);

  // Animation effect - only runs once per page load
  useEffect(() => {
    // Skip animation if it has already played
    if (hasAnimated) return;
    
    let currentIndex = 0;
    let animationTimers = [];
    
    const typingInterval = setInterval(() => {
      if (currentIndex <= greeting.length) {
        setDisplayText(greeting.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        
        // Wait before showing content
        const timer1 = setTimeout(() => {
          // Lock scroll position
          window.scrollTo(0, 0);
          
          // Mark animation as complete
          setIsTypingComplete(true);
          setHasAnimated(true);
          
          // Store in window object to persist across language changes
          if (typeof window !== 'undefined') {
            window.hasHeroAnimationPlayed = true;
          }
          
          // Re-enable scrolling after animations
          const timer2 = setTimeout(() => {
            document.documentElement.style.overflow = '';
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
          }, 1000);
          
          animationTimers.push(timer2);
        }, 300);
        
        animationTimers.push(timer1);
      }
    }, 100);

    return () => {
      clearInterval(typingInterval);
      animationTimers.forEach(timer => clearTimeout(timer));
    };
  }, [greeting, hasAnimated]);

  // Only scroll when user explicitly clicks the button - real user intention
  const handleScroll = () => {
    const about = document.getElementById('about');
    if (about) {
      about.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section 
      ref={heroRef}
      id="hero" 
      className="min-h-screen flex flex-col justify-center items-center text-center gap-6 px-4 relative overflow-hidden">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 40px, currentColor 40px, currentColor 41px),
                           repeating-linear-gradient(90deg, transparent, transparent 40px, currentColor 40px, currentColor 41px)`
        }}></div>
      </div>

      {/* Decorative comment elements */}
      <div className="absolute top-10 left-10 text-xs text-comment font-mono hidden lg:block">
        {'/* PORTFOLIO */'}
      </div>
      
      <div className="absolute bottom-10 right-10 text-xs text-comment font-mono hidden lg:block">
        {'/* v1.0.0 */'}
      </div>

      <div className="relative z-10">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-2">
          <span className="inline-block">
            {displayText}
            <span className={`${isTypingComplete ? 'cursor-blink' : ''} text-current`}>_</span>
          </span>
        </h1>
        
        {/* Hidden elements that define the final height but don't affect layout */}
        <div aria-hidden="true" style={{visibility: 'hidden', position: 'absolute', pointerEvents: 'none'}}>
          <p className="text-xl md:text-2xl">{t('subtitle')}</p>
          <div className="flex justify-center gap-4 mt-8">
            <span className="text-sm text-comment">[</span>
            <span className="text-sm uppercase tracking-widest">Creative Developer</span>
            <span className="text-sm text-comment">]</span>
          </div>
        </div>
        
        {/* Only show after typing with CSS transitions instead of React conditional rendering */}
        <div className={`transition-opacity duration-500 ${isTypingComplete ? 'opacity-100' : 'opacity-0'}`}>
          <div className="h-[3rem] mt-4">
            <p className="text-xl md:text-2xl">
              {t('subtitle')}
            </p>
          </div>
          
          <div className="h-[2.5rem] mt-8">
            <div className="flex justify-center gap-4">
              <span className="text-sm text-comment">[</span>
              <span className="text-sm uppercase tracking-widest">Creative Developer</span>
              <span className="text-sm text-comment">]</span>
            </div>
          </div>
          
          <div className="h-[4rem] mt-10 transition-opacity duration-500 delay-500">
            <button
              type="button"
              className="p-2 border-2 border-current btn-retro shadow-ink dark:shadow-paper animate-bounce"
              aria-label={t('cta')}
              onClick={handleScroll}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Scanline effect overlay */}
      <div className="scanlines absolute inset-0 pointer-events-none"></div>
    </section>
  );
}

export default Hero;
