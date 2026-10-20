import { type ComponentProps, useEffect, useRef } from 'react';
import { cx } from '../../utils/cx';
import { playOnce } from '../../utils/motion';

export interface GlitchThemeToggleProps
  extends Omit<ComponentProps<'button'>, 'children' | 'onClick'> {
  dark: boolean;
  onToggle: () => void;
  label?: string;
}

const JITTER: Keyframe[] = [
  { transform: 'translate(0, 0)' },
  { transform: 'translate(-5px, 2px)' },
  { transform: 'translate(4px, -1px)' },
  { transform: 'translate(-2px, 0)' },
  { transform: 'translate(2px, 1px)' },
  { transform: 'translate(0, 0)' },
];

const split = (x: number): Keyframe[] => [
  { opacity: 0.9, transform: `translateX(${x}px)` },
  { opacity: 0.9, transform: `translateX(${-x}px)`, offset: 0.4 },
  { opacity: 0.6, transform: `translateX(${x / 3}px)`, offset: 0.8 },
  { opacity: 0, transform: 'translateX(0)' },
];

function Icons() {
  return (
    <>
      <svg className="motiv-matrix-glitch__sun" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" />
      </svg>
      <svg className="motiv-matrix-glitch__moon" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" />
      </svg>
    </>
  );
}

export function GlitchThemeToggle({
  dark,
  onToggle,
  label = 'Toggle theme',
  className,
  ...props
}: GlitchThemeToggleProps) {
  const iconRef = useRef<HTMLSpanElement>(null);
  const redRef = useRef<HTMLSpanElement>(null);
  const cyanRef = useRef<HTMLSpanElement>(null);
  const prev = useRef(dark);

  useEffect(() => {
    if (prev.current === dark) return;
    prev.current = dark;
    const timing = { duration: 550, easing: 'steps(5)' };
    playOnce(iconRef.current, JITTER, timing);
    playOnce(redRef.current, split(-3), timing);
    playOnce(cyanRef.current, split(3), timing);
  }, [dark]);

  return (
    <button
      type="button"
      {...props}
      aria-label={label}
      aria-pressed={dark}
      className={cx('motiv-matrix-glitch', dark && 'motiv-matrix-glitch--dark', className)}
      onClick={onToggle}
    >
      <span className="motiv-matrix-glitch__icon" aria-hidden="true">
        <span ref={redRef} className="motiv-matrix-glitch__ghost motiv-matrix-glitch__ghost--red">
          <Icons />
        </span>
        <span ref={cyanRef} className="motiv-matrix-glitch__ghost motiv-matrix-glitch__ghost--cyan">
          <Icons />
        </span>
        <span ref={iconRef} className="motiv-matrix-glitch__main">
          <Icons />
        </span>
      </span>
    </button>
  );
}
