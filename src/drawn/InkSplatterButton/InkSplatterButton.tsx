import {
  type ComponentProps,
  type CSSProperties,
  type MouseEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';
import { cx } from '../../utils/cx';

export interface InkSplatterButtonProps extends ComponentProps<'button'> {
  icon?: ReactNode;
  successLabel?: ReactNode;
}

const SQUISH: Keyframe[] = [
  { scale: '1 1' },
  { scale: '0.92 1.06', offset: 0.3 },
  { scale: '1.04 0.96', offset: 0.6 },
  { scale: '1 1' },
];

// [angle in deg, distance in px, size in px]
const DROPS = [
  [0, 72, 9],
  [40, 88, 6],
  [85, 96, 9],
  [140, 70, 6],
  [190, 80, 9],
  [230, 66, 6],
  [280, 94, 9],
  [320, 76, 6],
];

export function InkSplatterButton({
  icon,
  successLabel,
  className,
  children,
  type = 'button',
  onClick,
  ...props
}: InkSplatterButtonProps) {
  const [burst, setBurst] = useState(0);
  const [success, setSuccess] = useState(false);
  const timer = useRef<number>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    setBurst(burst + 1);
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      event.currentTarget.animate(SQUISH, { duration: 450, easing: 'ease-out' });
    }
    if (successLabel) {
      setSuccess(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setSuccess(false), 1500);
    }
  };

  return (
    <>
      <button
        {...props}
        type={type}
        className={cx('motiv-splatter-button', className)}
        onClick={handleClick}
      >
        {burst > 0 && (
          // A new key remounts the drops, which restarts their animation.
          <span key={burst} className="motiv-splatter-button__drops" aria-hidden="true">
            {DROPS.map(([angle, distance, size]) => (
              <span
                key={angle}
                className="motiv-splatter-button__drop"
                style={
                  {
                    '--_a': `${angle}deg`,
                    '--_d': `${distance}px`,
                    '--_s': `${size}px`,
                  } as CSSProperties
                }
              />
            ))}
          </span>
        )}
        {icon && (
          <span className="motiv-splatter-button__icon" aria-hidden="true">
            {icon}
          </span>
        )}
        <span className="motiv-splatter-button__labels">
          <span
            className="motiv-splatter-button__label"
            data-active={!success || undefined}
            aria-hidden={success || undefined}
          >
            {children}
          </span>
          {successLabel && (
            <span
              className="motiv-splatter-button__label"
              data-active={success || undefined}
              aria-hidden={!success || undefined}
            >
              {successLabel}
            </span>
          )}
        </span>
      </button>
      {successLabel && (
        <span className="motiv-visually-hidden" aria-live="polite">
          {success && successLabel}
        </span>
      )}
    </>
  );
}
