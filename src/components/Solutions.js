import React, { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';

function Solutions() {
  const t = useTranslations('solutions');
  const sectionRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [activeNode, setActiveNode] = useState(null);
  
  const capabilities = [
    {
      id: 'problem-solving',
      icon: 'hn hn-lightbulb',
    },
    {
      id: 'automation',
      icon: 'hn hn-bolt-solid',
    },
    {
      id: 'solutions',
      icon: 'hn hn-grid',
    }
  ];

  // Enhanced scroll-based animations
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.2 } // Trigger when 20% of the section is visible
    );

    observer.observe(section);

    const handleScroll = () => {
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Only run if the section is in the viewport
      if (rect.top > windowHeight || rect.bottom < 0) {
        return;
      }

      // Calculate progress from 0 to 1 as the section moves through the viewport.
      // 0 = top of section is at bottom of viewport.
      // 1 = bottom of section is at top of viewport.
      const totalScrollDistance = windowHeight + rect.height;
      const currentScroll = windowHeight - rect.top;
      
      // Make the animation complete when 85% of the scroll is done to ensure it always finishes.
      const progress = currentScroll / (totalScrollDistance * 0.85);
      
      const scrollValue = Math.min(Math.max(progress, 0), 1);
      setScrollProgress(scrollValue);

      // Set active node based on scroll position
      if (scrollValue < 0.33) {
        setActiveNode(0);
      } else if (scrollValue < 0.66) {
        setActiveNode(1);
      } else {
        setActiveNode(2);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call

    return () => {
      observer.unobserve(section);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Calculate connection line animations
  const line1Progress = Math.min(scrollProgress * 3, 1);
  const line2Progress = scrollProgress > 0.33 ? Math.min((scrollProgress - 0.33) * 3, 1) : 0;
  
  return (
    <section id="solutions" className="px-4 py-24 relative retro-grid min-h-[80vh]" ref={sectionRef}>
      {/* Background elements */}
      <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full bg-ink/20 dark:bg-paper/20 blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-ink/20 dark:bg-paper/20 blur-3xl"></div>
      </div>
      
      <div className="max-w-4xl mx-auto relative">
        <h2 className="text-center text-3xl md:text-4xl mb-4 font-bold">
          <span className={`transition-transform duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}>
            {t('heading')}
          </span>
        </h2>
        
        <p className={`text-center text-lg mb-20 max-w-2xl mx-auto opacity-80 transition-opacity duration-1000 delay-300 ${isVisible ? 'opacity-80' : 'opacity-0'}`}>
          {t('subheading')}
        </p>
        
        {/* Node Connection System with enhanced scroll dynamics */}
        <div className="relative">
          {/* Fixed height connection line between only the nodes */}
          <div className="absolute left-1/2 transform -translate-x-1/2" style={{ top: '3px', height: 'calc(100% - 182px)', width: '2px' }}>
            {/* Background line */}
            <div className="absolute h-full w-full bg-ink/20 dark:bg-paper/20"></div>
            
            {/* Active fill that grows with scroll */}
            <div 
              className="absolute top-0 w-full bg-ink dark:bg-paper transition-all duration-500" 
              style={{ height: `${Math.min(scrollProgress * 100, 100)}%` }}
            />
          </div>
          
          <div className="space-y-28 relative z-10">
            {capabilities.map((capability, index) => {
              const isActive = activeNode === index;
              const wasActive = scrollProgress > (index / capabilities.length);
              const delay = index * 150;
              
              return (
                <div 
                  key={capability.id}
                  className={`relative transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
                  style={{ 
                    transitionDelay: `${delay}ms`,
                    transform: `translateY(${isActive ? '0' : wasActive ? '-10px' : '10px'})`,
                  }}
                >
                  {/* Node connection point */}
                  <div className={`absolute left-8 md:left-1/2 md:transform md:-translate-x-1/2 w-6 h-6 rounded-full border-2 transition-all duration-300
                    border-ink dark:border-paper
                    bg-paper dark:bg-ink z-20`}
                  ></div>
                  
                  {/* Node-to-card connector */}
                  <div className={`hidden absolute left-8 md:left-1/2 md:transform md:-translate-x-1/2 top-6 h-6 w-0.5 bg-ink/40 dark:bg-paper/40 z-10`}></div>

                  {/* Content card */}
                  <div className={`flex items-center justify-center transition-all duration-500 ml-8 md:ml-0 opacity-100 scale-100
                    ${index % 2 === 0 ? 'md:mr-[50%]' : 'md:ml-[50%]'}`}
                  >
                    <div className="card shadow-ink dark:shadow-paper p-6 max-w-xs w-full">
                      {/* Icon */}
                      <div className="flex items-center mb-3">
                        <div className="w-10 h-10 flex items-center justify-center mr-3">
                          <i className={`${capability.icon} text-2xl`}></i>
                        </div>
                        
                        <h3 className="text-lg font-bold">
                          {capability.id === 'problem-solving' && t('problem-solving.title')}
                          {capability.id === 'automation' && t('automation.title')}
                          {capability.id === 'solutions' && t('solutions.title')}
                        </h3>
                      </div>
                      
                      {/* Just the description - simplified */}
                      <p className="text-sm opacity-80">
                        {capability.id === 'problem-solving' && t('problem-solving.description')}
                        {capability.id === 'automation' && t('automation.description')}
                        {capability.id === 'solutions' && t('solutions.description')}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Solutions;
