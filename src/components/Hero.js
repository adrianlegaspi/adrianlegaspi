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
    }, 50);

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
      <div className="relative z-10">
        {/* DotGothic16 is itself fixed-width, so it types out behind the
            block caret without the glyph-advance jitter a proportional
            font would cause. */}
        <h1 className="font-chrome text-4xl md:text-6xl lg:text-7xl font-bold mb-2">
          <span className="inline-block">
            {displayText}
            <span className={`${isTypingComplete ? 'cursor-blink' : ''} text-current`}>_</span>
          </span>
        </h1>

        {/* Hidden element reserving the final height so the layout doesn't
            jump when the typing animation finishes. */}
        <div aria-hidden="true" style={{visibility: 'hidden', position: 'absolute', pointerEvents: 'none'}}>
          <p className="text-base md:text-lg">{t('subtitle')}</p>
        </div>

        {/* Revealed after typing via CSS transition rather than conditional render */}
        <div className={`transition-opacity duration-500 ${isTypingComplete ? 'opacity-100' : 'opacity-0'}`}>
          <div className="h-[3rem] mt-4">
            <p className="text-base md:text-lg">
              <span className="badge-accent font-chrome font-bold tracking-wide">{t('subtitle')}</span>
            </p>
          </div>

          <div className="h-[4rem] mt-10 transition-opacity duration-500 delay-500">
            <button
              type="button"
              className="btn-retro animate-nudge h-10 w-10"
              aria-label={t('cta')}
              onClick={handleScroll}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* CRT scanlines: monitor artefact, part of the old-PC story */}
      <div className="scanlines absolute inset-0 pointer-events-none"></div>
    </section>
  );
}

export default Hero;
