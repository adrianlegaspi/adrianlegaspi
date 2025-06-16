import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

function ProjectCard({ name, description, live, repo }) {
  return (
    <div className={classNames('card', 'flex flex-col justify-between h-full')}>
      <div>
        <h3 className="text-xl font-semibold mb-2">{name}</h3>
        <p className="mb-4">{description}</p>
      </div>
      <div className="mt-auto flex gap-2">
        <a
          href={live}
          target="_blank"
          rel="noreferrer"
          className="underline"
        >
          Live
        </a>
        <a
          href={repo}
          target="_blank"
          rel="noreferrer"
          className="underline"
        >
          Repo
        </a>
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
