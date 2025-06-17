import React, { useState } from 'react';
import { useTranslations } from 'next-intl';

const stack = ['Next.js', 'React', 'TailwindCSS', 'Node.js', 'Express', 'MongoDB'];

function Stack() {
  const t = useTranslations('stack');
  const [hoveredTech, setHoveredTech] = useState(null);
  
  return (
    <section id="stack" className="px-4 relative">
      {/* Background grid */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
          backgroundSize: `20px 20px`
        }}></div>
      </div>
      
      <h2 className="text-center text-3xl mb-10 relative inline-block mx-auto">
        <span className="relative z-10">{t('heading')}</span>
        <div className="absolute -bottom-2 left-0 right-0 h-1 bg-current opacity-20"></div>
        <div className="absolute -left-4 -right-4 top-1/2 h-px bg-current opacity-10"></div>
      </h2>
      
      <div className="flex flex-wrap justify-center gap-6 max-w-4xl mx-auto">
        {stack.map((tech) => {
          const isHovered = hoveredTech === tech;
          return (
            <div
              key={tech}
              className="relative perspective-500"
              onMouseEnter={() => setHoveredTech(tech)}
              onMouseLeave={() => setHoveredTech(null)}
            >
              <div 
                className={`px-4 py-2 border-2 border-ink dark:border-paper transition-all duration-300 relative group
                  ${isHovered ? 'translate-y-[-2px] shadow-lg' : ''}`}
                style={{
                  boxShadow: isHovered ? '3px 3px 0 #040005' : 'none',
                  transform: `${isHovered ? 'scale(1.05)' : 'scale(1)'}`
                }}
              >
                {/* ASCII decoration */}
                <div className="absolute top-0 right-0 opacity-20 text-xs -mt-3 -mr-3 group-hover:opacity-100 transition-opacity">
                  {isHovered ? '▲' : '○'}
                </div>
                
                {/* Tech icon ASCII representation */}
                <div className="flex items-center gap-2">
                  <span className="text-xl font-mono tracking-tight relative">
                    {tech}
                    {isHovered && (
                      <span className="absolute bottom-0 left-0 right-0 h-px bg-current animate-pulse"></span>
                    )}
                  </span>
                </div>
                
                {/* Status indicator */}
                <div className={`absolute -top-1 -right-1 w-2 h-2 rounded-full transition-all duration-300
                  ${isHovered ? 'bg-current animate-pulse' : 'bg-transparent'}`}></div>
              </div>
              
              {/* Tooltip on hover */}
              {isHovered && (
                <div className="absolute -bottom-8 left-0 right-0 text-center text-xs text-comment animate-slide-up">
                  <span className="inline-block">{'{ '}</span>
                  <span className="inline-block">{tech.toLowerCase().replace('.', '_')}</span>
                  <span className="inline-block">{' }'}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Decorative elements */}
      <div className="max-w-4xl mx-auto mt-12 flex justify-between text-xs text-comment px-4">
        <div>{'// Stack used in projects'}</div>
        <div>{'/* ' + new Date().getFullYear() + ' */'}</div>
      </div>
    </section>
  );
}

export default Stack;
