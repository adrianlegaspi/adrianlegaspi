import React from 'react';
import { useTranslations } from 'next-intl';
import projectsData from '../data/projects';
import ProjectCard from './ProjectCard';

function Projects() {
  const t = useTranslations('projects');
  return (
    <section id="projects" className="px-4">
      <h2 className="text-center text-3xl mb-8">{t('heading')}</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {projectsData.map((project) => (
          <ProjectCard key={project.name} {...project} />
        ))}
      </div>
    </section>
  );
}

export default Projects;
