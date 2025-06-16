import React from 'react';
import { useTranslations } from 'next-intl';

const stack = ['Next.js', 'React', 'TailwindCSS', 'Node.js', 'Express', 'MongoDB'];

function Stack() {
  const t = useTranslations('stack');
  return (
    <section id="stack" className="px-4">
      <h2 className="text-center text-3xl mb-8">{t('heading')}</h2>
      <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
        {stack.map((tech) => (
          <span
            key={tech}
            className="px-4 py-2 border border-ink/20 dark:border-paper/20 rounded-md shadow-inner"
          >
            {tech}
          </span>
        ))}
      </div>
    </section>
  );
}

export default Stack;
