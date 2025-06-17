import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

function ProjectCard({ name, description, live, repo }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className={classNames('card', 'flex flex-col justify-between h-full group relative overflow-hidden shadow-ink transition-all duration-300')}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ASCII border decoration on hover */}
      {isHovered && (
        <div className="absolute inset-0 pointer-events-none opacity-10">
          <div className="absolute top-0 left-0 text-xs">┌─</div>
          <div className="absolute top-0 right-0 text-xs">─┐</div>
          <div className="absolute bottom-0 left-0 text-xs">└─</div>
          <div className="absolute bottom-0 right-0 text-xs">─┘</div>
        </div>
      )}
      
      <div>
        <h3 className="text-xl font-semibold mb-2 group-hover:animate-glitch">{name}</h3>
        <p className="mb-4 text-comment group-hover:text-current transition-all duration-300">{description}</p>
      </div>
      
      {/* Enhanced link buttons */}
      <div className="mt-auto flex gap-4">
        <a
          href={live}
          target="_blank"
          rel="noreferrer"
          className="relative px-4 py-2 border border-current text-sm uppercase tracking-wider hover:bg-ink hover:text-paper dark:hover:bg-paper dark:hover:text-ink transition-all duration-200 group/link"
        >
          <span className="relative z-10">Live</span>
          <span className="absolute left-0 opacity-0 group-hover/link:opacity-100 transition-opacity">{'>'}</span>
        </a>
        <a
          href={repo}
          target="_blank"
          rel="noreferrer"
          className="relative px-4 py-2 border border-current text-sm uppercase tracking-wider hover:bg-ink hover:text-paper dark:hover:bg-paper dark:hover:text-ink transition-all duration-200 group/link"
        >
          <span className="relative z-10">Repo</span>
          <span className="absolute left-0 opacity-0 group-hover/link:opacity-100 transition-opacity">{'>'}</span>
        </a>
      </div>
      
      {/* Retro terminal-style status indicator */}
      <div className="absolute top-2 right-2 flex gap-1 opacity-20 group-hover:opacity-100 transition-opacity">
        <div className="w-2 h-2 bg-current rounded-full animate-pulse"></div>
        <div className="w-2 h-2 bg-current rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-2 h-2 bg-current rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
      </div>
    </div>
  );
}

ProjectCard.propTypes = {
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  live: PropTypes.string.isRequired,
  repo: PropTypes.string.isRequired,
};

export default ProjectCard;
