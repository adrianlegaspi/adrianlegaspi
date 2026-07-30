import React from 'react';
import Window from './Window';

// NOTE: Not currently rendered — nothing imports Projects/ProjectCard. Kept
// in sync with the chrome system so there are no dangling class references,
// but it is a deletion candidate.
function ProjectCard({ name, description, live, repo }) {
  return (
    <Window
      title={name}
      titleAs="h3"
      icon="hn-folder"
      className="h-full"
      bodyClassName="p-4 flex flex-col h-full"
    >
      <p className="mb-4 text-sm">{description}</p>

      <div className="mt-auto flex gap-2">
        <a
          href={live}
          target="_blank"
          rel="noreferrer"
          className="btn-retro px-3 py-1.5 text-xs"
        >
          Open
        </a>
        <a
          href={repo}
          target="_blank"
          rel="noreferrer"
          className="btn-retro px-3 py-1.5 text-xs"
        >
          Source
        </a>
      </div>
    </Window>
  );
}

export default ProjectCard;
