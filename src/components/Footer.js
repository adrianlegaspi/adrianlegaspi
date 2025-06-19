import React from 'react';

function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="relative py-8 border-t-2 border-dashed border-ink dark:border-paper">
      {/* Decorative line pattern */}
      <div className="absolute top-0 left-0 right-0 h-px bg-current opacity-10"></div>
      
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Copyright with terminal style */}
          <div className="flex items-center gap-2">
            <span className="text-comment inline-block w-2 h-2 bg-current rounded-full opacity-40 animate-pulse"></span>
            <span className="font-mono text-sm text-comment">
              /* © {currentYear} */ Adrian Legaspi
            </span>
          </div>
          
          {/* Footer decorative element */}
          <div className="hidden md:block font-mono text-xs text-comment tracking-widest">
            {'/* END */'}
          </div>
          
          {/* Retro-styled stats */}
          <div className="flex gap-4 text-xs font-mono text-comment">
            <div>{'[ VERSION 1.0.1 ]'}</div>
            <div className="hidden md:block">{'[ LAST UPDATE: ' + currentYear + ' ]'}</div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
