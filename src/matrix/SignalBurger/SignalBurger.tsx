import { type ComponentProps, useEffect, useRef } from 'react';
import { cx } from '../../utils/cx';
import { playOnce } from '../../utils/motion';

export interface SignalBurgerProps extends Omit<ComponentProps<'button'>, 'children' | 'onClick'> {
  open: boolean;
  onToggle: () => void;
  label?: string;
}

const split = (x: number): Keyframe[] => [
  { opacity: 0, transform: 'translateX(0)' },
  { opacity: 1, transform: `translateX(${x}px)`, offset: 0.3 },
  { opacity: 1, transform: `translate(${-x * 0.7}px, 1px)`, offset: 0.6 },
  { opacity: 0, transform: 'translateX(0)' },
];

export function SignalBurger({
  open,
  onToggle,
  label = 'Menu',
  className,
  ...props
}: SignalBurgerProps) {
  const barsRef = useRef<HTMLSpanElement>(null);
  const prev = useRef(open);

  useEffect(() => {
    if (prev.current === open) return;
    prev.current = open;
    const timing = { duration: 350, easing: 'steps(2)' };
    for (const bar of barsRef.current?.children ?? []) {
      playOnce(bar, split(-3), { ...timing, pseudoElement: '::before' });
      playOnce(bar, split(3), { ...timing, pseudoElement: '::after' });
    }
  }, [open]);

  return (
    <button
      type="button"
      {...props}
      aria-label={label}
      aria-expanded={open}
      className={cx('motiv-matrix-burger', open && 'motiv-matrix-burger--open', className)}
      onClick={onToggle}
    >
      <span ref={barsRef} className="motiv-matrix-burger__bars" aria-hidden="true">
        <span className="motiv-matrix-burger__bar" />
        <span className="motiv-matrix-burger__bar" />
        <span className="motiv-matrix-burger__bar" />
      </span>
    </button>
  );
}
