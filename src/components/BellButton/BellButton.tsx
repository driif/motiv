import { type ComponentProps, useEffect, useRef } from 'react';
import { cx } from '../../utils/cx';
import { Icon } from '../../utils/Icon';
import { EASE_OUT, playOnce, SPRING, SWING } from '../../utils/motion';

const RIPPLE: Keyframe[] = [
  { opacity: 0.8, scale: '1' },
  { opacity: 0, scale: '2.3' },
];
const POP: Keyframe[] = [{ scale: '0.5' }, { scale: '1.25', offset: 0.6 }, { scale: '1' }];

export interface BellButtonProps extends Omit<ComponentProps<'button'>, 'children'> {
  count: number;
  label?: string;
  /** Announced after the count: "Notifications, 3 new". */
  newText?: string;
  max?: number;
}

export function BellButton({
  count,
  label = 'Notifications',
  newText = 'new',
  max = 99,
  className,
  ...props
}: BellButtonProps) {
  const iconRef = useRef<HTMLSpanElement>(null);
  const badgeRef = useRef<HTMLSpanElement>(null);
  const ripple1 = useRef<HTMLSpanElement>(null);
  const ripple2 = useRef<HTMLSpanElement>(null);
  const prev = useRef(count);

  useEffect(() => {
    if (count > prev.current) {
      playOnce(iconRef.current, SWING, { duration: 750, easing: EASE_OUT });
      playOnce(badgeRef.current, POP, { duration: 450, easing: SPRING });
      playOnce(ripple1.current, RIPPLE, { duration: 1000, easing: EASE_OUT });
      playOnce(ripple2.current, RIPPLE, { duration: 1000, delay: 160, easing: EASE_OUT });
    }
    prev.current = count;
  }, [count]);

  return (
    <button
      type="button"
      {...props}
      aria-label={count > 0 ? `${label}, ${count} ${newText}` : label}
      className={cx('motiv-bell', className)}
    >
      <span ref={ripple1} className="motiv-bell__ripple" aria-hidden="true" />
      <span ref={ripple2} className="motiv-bell__ripple" aria-hidden="true" />
      <span ref={iconRef} className="motiv-bell__icon" aria-hidden="true">
        <Icon>
          <path d="M6 16v-5a6 6 0 0 1 12 0v5l1.5 2h-15z" />
          <path d="M10 20.5a2 2 0 0 0 4 0" />
        </Icon>
      </span>
      <span ref={badgeRef} className="motiv-bell__badge" data-on={count > 0} aria-hidden="true">
        {count > max ? `${max}+` : count}
      </span>
    </button>
  );
}
