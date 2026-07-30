import React from 'react';
import { useTranslations } from 'next-intl';
import Window from './Window';

const stack = ['Next.js', 'React', 'TailwindCSS', 'Node.js', 'Express', 'MongoDB'];

// NOTE: Not currently rendered: nothing imports Stack, and the `stack`
// translation namespace it reads does not exist in either locale file. Kept
// in sync with the chrome system so there are no dangling class references,
// but it is a deletion candidate.
function Stack() {
  const t = useTranslations('stack');

  return (
    <section id="stack" className="px-4 relative">
      <Window
        title={t('heading')}
        titleAs="h2"
        icon="hn-grid"
        status={[`${stack.length} items`]}
        className="max-w-4xl mx-auto"
        bodyClassName="p-4"
      >
        {/* Beveled tiles, in the manner of a Control Panel list */}
        <ul className="flex flex-wrap justify-center gap-2">
          {stack.map((tech) => (
            <li key={tech} className="bevel-raised px-3 py-1.5">
              <span className="font-chrome text-ink text-sm">{tech}</span>
            </li>
          ))}
        </ul>
      </Window>
    </section>
  );
}

export default Stack;
