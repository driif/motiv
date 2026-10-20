import { type ComponentProps, type ReactNode, useId } from 'react';
import { cx } from '../../utils/cx';

export interface OrbitalThemeToggleProps extends Omit<ComponentProps<'div'>, 'children'> {
  dark: boolean;
  onToggle: () => void;
  label?: string;
  figure?: ReactNode;
  note?: ReactNode;
  hint?: ReactNode;
}

export function OrbitalThemeToggle({
  dark,
  onToggle,
  label = 'Dark mode',
  figure = 'Fig. 01 / A change of atmosphere',
  note = (
    <>
      a familiar orbit,
      <br />
      <em>an unexpected feeling.</em>
    </>
  ),
  hint = 'go on, give it a click',
  className,
  ...props
}: OrbitalThemeToggleProps) {
  const filterId = `motiv-ink-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  return (
    <div
      {...props}
      className={cx('motiv-orbital-toggle', dark && 'motiv-orbital-toggle--dark', className)}
    >
      <svg className="motiv-orbital-toggle__defs" aria-hidden="true" focusable="false">
        <defs>
          <filter id={filterId} x="-15%" y="-15%" width="130%" height="130%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.035"
              numOctaves={2}
              seed={8}
              result="noise"
            />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale={2} />
          </filter>
        </defs>
      </svg>
      {figure != null && (
        <span className="motiv-orbital-toggle__figure" aria-hidden="true">
          {figure}
        </span>
      )}
      <svg className="motiv-orbital-toggle__orbits" viewBox="0 0 440 280" aria-hidden="true">
        <ellipse cx="224" cy="141" rx="166" ry="79" transform="rotate(-27 224 141)" />
        <ellipse cx="224" cy="141" rx="149" ry="99" transform="rotate(28 224 141)" />
        <path className="motiv-orbital-toggle__dash" d="M52 198c51 53 228 61 335-83" />
        <path
          className="motiv-orbital-toggle__stars"
          d="M356 36v28m-14-14h28M73 86v15m-7-7h15M329 218v13m-6-6h13"
        />
        <circle cx="78" cy="204" r="5" />
        <circle cx="369" cy="122" r="3" />
      </svg>
      <div
        className="motiv-orbital-toggle__wash"
        style={{ filter: `url(#${filterId})` }}
        aria-hidden="true"
      />
      <button
        type="button"
        className="motiv-orbital-toggle__button"
        aria-pressed={dark}
        aria-label={label}
        onClick={onToggle}
      >
        <svg className="motiv-orbital-toggle__sun" viewBox="0 0 100 100" aria-hidden="true">
          <circle cx="50" cy="50" r="20" />
          <path d="M50 7v11m0 64v11M7 50h11m64 0h11M20 20l8 8m44 44 8 8M20 80l8-8m44-44 8-8" />
        </svg>
        <svg className="motiv-orbital-toggle__moon" viewBox="0 0 100 100" aria-hidden="true">
          <path d="M69 72A32 32 0 0 1 38 20a29 29 0 1 0 31 52Z" />
          <path d="M72 19v15m-7-7h15" />
        </svg>
      </button>
      {note != null && (
        <div className="motiv-orbital-toggle__note" aria-hidden="true">
          {note}
          <svg viewBox="0 0 64 42" aria-hidden="true">
            <path d="M58 34C30 41 35 12 9 9m0 0 6 10M9 9l12-3" />
          </svg>
        </div>
      )}
      {hint != null && (
        <span className="motiv-orbital-toggle__hint" aria-hidden="true">
          {hint}
        </span>
      )}
    </div>
  );
}
