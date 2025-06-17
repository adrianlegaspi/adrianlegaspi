import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

function Contact() {
  const t = useTranslations('contact');
  const [cursorVisible, setCursorVisible] = useState(true);
  const [commandStatus, setCommandStatus] = useState({ command: '> connecting...', completed: false });
  const [showEmail, setShowEmail] = useState(false);
  const email = 'contacto@adrianlegaspi.dev';
  
  // Blinking cursor effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible(prev => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Terminal command simulation effect
  useEffect(() => {
    const timeout1 = setTimeout(() => {
      setCommandStatus({ command: '> establishing_connection', completed: false });
    }, 1000);
    
    const timeout2 = setTimeout(() => {
      setCommandStatus({ command: '> connection_established', completed: true });
    }, 2000);
    
    const timeout3 = setTimeout(() => {
      setShowEmail(true);
    }, 2500);
    
    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      clearTimeout(timeout3);
    };
  }, []);

  return (
    <section id="contact" className="py-16 px-4 relative">
      {/* Background effect */}
      <div className="absolute inset-0 opacity-5 crt-effect"></div>
      
      {/* Central terminal window */}
      <div className="max-w-lg mx-auto border-2 border-current overflow-hidden relative">
        {/* Terminal header */}
        <div className="bg-ink/10 dark:bg-paper/10 px-4 py-2 flex justify-between items-center border-b border-current">
          <div className="text-sm font-bold uppercase tracking-wider">{t('heading')}</div>
          <div className="flex gap-2">
            <span className="inline-block w-3 h-3 rounded-full bg-current opacity-20"></span>
            <span className="inline-block w-3 h-3 rounded-full bg-current opacity-50"></span>
            <span className="inline-block w-3 h-3 rounded-full bg-current opacity-80"></span>
          </div>
        </div>
        
        {/* Terminal content */}
        <div className="bg-ink/5 dark:bg-paper/5 p-6 font-mono text-sm relative min-h-[200px]">
          <div className="mb-2 flex">
            <span className="text-green-600 dark:text-green-400">system</span>
            <span className="mx-1">:</span>
            <span className="text-blue-600 dark:text-blue-400">~</span>
            <span className="mx-1">$</span>
            <span>contact --init</span>
          </div>
          
          <div className="mb-4">
            <div>{commandStatus.command}{!commandStatus.completed && <span className={cursorVisible ? 'opacity-100' : 'opacity-0'}>_</span>}</div>
            {commandStatus.completed && (
              <div className="text-green-600 dark:text-green-400">{'> success'}</div>
            )}
          </div>
          
          {showEmail && (
            <div className="animate-slide-up mb-4">
              <div className="mb-2">{'// Contact Information'}</div>
              <div className="flex gap-2 my-2">
                <span className="text-blue-600 dark:text-blue-400">{'const'}</span> 
                <span>{'email ='}</span> 
                <a 
                  href={`mailto:${email}`}
                  className="group relative overflow-hidden inline-block"
                  onMouseEnter={() => setCursorVisible(false)}
                  onMouseLeave={() => setCursorVisible(true)}
                >
                  <span className="text-green-600 dark:text-green-400">'{email}'</span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-current group-hover:w-full transition-all duration-300"></span>
                </a>
              </div>
            </div>
          )}
          
          {/* Animated cursor */}
          <div className="absolute bottom-4 left-6">
            <span className="text-sm">{showEmail ? '>' : ''}</span>
            <span className={`${cursorVisible ? 'opacity-100' : 'opacity-0'} transition-opacity`}>_</span>
          </div>
          
          {/* ASCII decoration */}
          <div className="absolute bottom-4 right-4 text-xs opacity-30">
            {'[ESC] to exit'}
          </div>
        </div>
      </div>
      
      {/* Retro decorative elements */}
      <div className="flex justify-center mt-8 opacity-40">
        <div className="text-xs tracking-widest uppercase">{'// End of transmission //'}</div>
      </div>
      
      <div className="scanlines absolute inset-0 opacity-10 pointer-events-none"></div>
    </section>
  );
}

export default Contact;
