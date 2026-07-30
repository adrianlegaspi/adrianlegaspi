import React from 'react';

// Single source of truth for the displayed build number. The Hero used to
// print a conflicting "v1.0.0" while this footer said "VERSION 1.0.1"; the
// Hero label is gone and this is now the only version on the page.
const BUILD = '1.0.0';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bevel-raised mt-8">
      <div className="flex flex-col items-stretch gap-[3px] p-[3px] md:flex-row md:items-center">
        {/* Primary status cell */}
        <div className="bevel-sunken flex flex-1 items-center gap-2 px-2 py-1">
          <span className="led shrink-0" aria-hidden="true" />
          <span className="font-chrome text-chrome-text text-[11px] leading-none">
            Adrian Legaspi © {currentYear}
          </span>
        </div>

        {/* Indicator cells, in the manner of NUM / CAPS */}
        <div className="bevel-sunken px-2 py-1">
          <span className="font-chrome text-chrome-text text-[11px] leading-none">
            v{BUILD}
          </span>
        </div>

        <div className="bevel-sunken hidden px-2 py-1 md:block">
          <span className="font-chrome text-chrome-text text-[11px] leading-none">
            {currentYear}
          </span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
