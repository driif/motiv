import { type ComponentProps, useEffect, useRef } from 'react';
import { cx } from '../../utils/cx';
import { EASE_OUT, playOnce, SWING } from '../../utils/motion';

export interface MuteToggleProps extends Omit<ComponentProps<'button'>, 'onChange' | 'children'> {
  muted: boolean;
  onChange: (muted: boolean) => void;
  /** Accessible name; the state is announced through aria-pressed. */
  label?: string;
  onText?: string;
  mutedText?: string;
}

export function MuteToggle({
  muted,
  onChange,
  label = 'Mute notifications',
  onText = 'Notifications on',
  mutedText = 'Muted',
  className,
  onClick,
  ...props
}: MuteToggleProps) {
  const bellRef = useRef<SVGGElement>(null);
  const prev = useRef(muted);

  useEffect(() => {
    if (!muted && prev.current)
      playOnce(bellRef.current, SWING, { duration: 750, easing: EASE_OUT });
    prev.current = muted;
  }, [muted]);

  return (
    <button
      type="button"
      {...props}
      aria-pressed={muted}
      aria-label={label}
      className={cx('motiv-mute', className)}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) onChange(!muted);
      }}
    >
      <svg
        className="motiv-mute__icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.65}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <g ref={bellRef} className="motiv-mute__bell">
          <path d="M6 16v-5a6 6 0 0 1 12 0v5l1.5 2h-15z" />
          <path d="M10 20.5a2 2 0 0 0 4 0" />
        </g>
        <path className="motiv-mute__slash" d="M3.5 3.5l17 17" />
      </svg>
      <span className="motiv-mute__roll" aria-hidden="true">
        <span className="motiv-mute__strip">
          <span>{onText}</span>
          <span>{mutedText}</span>
        </span>
      </span>
    </button>
  );
}
