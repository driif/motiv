import { type ComponentProps, type CSSProperties, useLayoutEffect, useRef } from 'react';
import { cx } from '../../utils/cx';
import { Icon } from '../../utils/Icon';
import { prefersReducedMotion } from '../../utils/motion';

const DURATION = 1000;
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

export interface ProgressRingProps extends ComponentProps<'div'> {
  /** 0–100 */
  value: number;
  label: string;
  /** Diameter in px */
  size?: number;
  /** Swap the number for a check at 100% */
  showCheck?: boolean;
}

export function ProgressRing({
  value,
  label,
  size = 120,
  showCheck = true,
  className,
  style,
  ...props
}: ProgressRingProps) {
  const target = Math.round(Math.min(100, Math.max(0, value)));
  const numRef = useRef<HTMLElement>(null);
  // The number on screen, so a value change mid count-up continues from there.
  const shown = useRef(target);

  // The count-up writes React's own text node, so no state changes per frame; React sets the
  // final value on render and the next render with the same target leaves the node alone.
  useLayoutEffect(() => {
    const from = shown.current;
    const text = numRef.current?.firstChild;
    if (!text) return;
    if (from === target || prefersReducedMotion()) {
      text.nodeValue = String(target);
      shown.current = target;
      return;
    }
    text.nodeValue = String(from);
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION);
      shown.current = Math.round(from + (target - from) * easeInOutCubic(t));
      text.nodeValue = String(shown.current);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target]);

  return (
    <div
      {...props}
      className={cx('motiv-ring', className)}
      data-done={(showCheck && target === 100) || undefined}
      style={{ ...style, '--_size': `${size}px` } as CSSProperties}
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={target}
    >
      <svg className="motiv-ring__dial" viewBox="0 0 120 120" aria-hidden="true">
        <circle className="motiv-ring__track" cx="60" cy="60" r="50" />
        <circle
          className="motiv-ring__arc"
          cx="60"
          cy="60"
          r="50"
          pathLength={1}
          style={{ strokeDashoffset: 1 - target / 100 }}
        />
      </svg>
      <span className="motiv-ring__num" aria-hidden="true">
        <b ref={numRef}>{target}</b>
        <small>%</small>
      </span>
      <Icon className="motiv-ring__check">
        <path d="M5 12.5l4.5 4.5L19 7.5" />
      </Icon>
    </div>
  );
}
