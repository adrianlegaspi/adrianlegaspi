import React from 'react';

/**
 * A Win9x-era window frame: raised bevel, filled title bar, sunken client
 * area, optional sunken status-bar cells.
 *
 * This is the piece that replaces the old source-code framing. Labels that
 * used to be rendered as `/* COMMENTS *\/` are now window titles, and the
 * `EOF` marker is now a status bar — the chrome carries the decoration, so
 * the copy doesn't have to.
 *
 * The `_ □ ×` controls are decorative: they are real chrome, not fake
 * buttons, so they are hidden from assistive tech rather than exposed as
 * controls that do nothing.
 */
function Window({
  title,
  icon,
  status,
  children,
  className = '',
  bodyClassName = '',
  titleClassName = '',
  controls = true,
  // For small cards the title bar IS the only label, so it can carry the real
  // heading element instead of duplicating the text inside the client area.
  // Sections that need a full-size heading pass a filename here instead and
  // keep their <h2> in the client area, the way a document window worked.
  titleAs: TitleTag = 'span',
}) {
  return (
    <div className={`bevel-raised p-[3px] ${className}`}>
      {/* Title bar */}
      <div className="flex items-center gap-2 bg-titlebar px-1.5 py-1 select-none">
        {icon && (
          <i className={`hn ${icon} text-titlebar-text text-[10px]`} aria-hidden="true" />
        )}
        <TitleTag
          className={`text-titlebar-text m-0 truncate text-xs font-bold tracking-wide ${
            titleClassName || 'font-chrome'
          }`}
        >
          {title}
        </TitleTag>
        {controls && (
          <span className="ml-auto flex shrink-0 items-center gap-0.5" aria-hidden="true">
            <span className="window-control">
              {/* Minimise: a baseline bar, drawn rather than typed */}
              <span className="mt-[4px] h-[2px] w-[6px] bg-ink" />
            </span>
            <span className="window-control">
              <span className="h-[7px] w-[7px] border border-ink border-t-2" />
            </span>
            <span className="window-control font-bold">×</span>
          </span>
        )}
      </div>

      {/* Client area */}
      <div className={`bevel-sunken mt-[3px] bg-desktop text-ink ${bodyClassName}`}>
        {children}
      </div>

      {/* Status bar */}
      {status && status.length > 0 && (
        <div className="mt-[3px] flex items-stretch gap-[3px]">
          {status.map((cell, i) => (
            <div
              key={cell}
              className={`bevel-sunken font-chrome text-chrome-text px-2 py-[3px] text-[10px] leading-none ${
                i === 0 ? 'flex-1' : ''
              }`}
            >
              {cell}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Window;
