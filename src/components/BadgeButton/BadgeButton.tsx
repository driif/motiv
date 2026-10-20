import { type ComponentProps, type ReactNode, useEffect, useRef } from 'react';
import { cx } from '../../utils/cx';
import { Icon } from '../../utils/Icon';
import { EASE_OUT, playOnce, SPRING } from '../../utils/motion';
import { Odometer } from '../Odometer/Odometer';

const BUMP: Keyframe[] = [{ scale: '1' }, { scale: '1.3', offset: 0.4 }, { scale: '1' }];
const RING: Keyframe[] = [
  { opacity: 0.7, scale: '1' },
  { opacity: 0, scale: '1.9' },
];

export interface BadgeButtonProps extends Omit<ComponentProps<'button'>, 'children'> {
  count: number;
  /** e.g. "Inbox", announced as "Inbox, 3 unread". */
  label: string;
  icon?: ReactNode;
  max?: number;
  unreadText?: string;
}

export function BadgeButton({
  count,
  label,
  icon = (
    <Icon>
      <path d="M4 13l2.5-8h11L20 13v6H4z" />
      <path d="M4 13h5l1 2h4l1-2h5" />
    </Icon>
  ),
  max = 99,
  unreadText = 'unread',
  className,
  ...props
}: BadgeButtonProps) {
  const badgeRef = useRef<HTMLSpanElement>(null);
  const ringRef = useRef<HTMLSpanElement>(null);
  const prev = useRef(count);

  useEffect(() => {
    if (count > prev.current && prev.current > 0) {
      playOnce(badgeRef.current, BUMP, { duration: 450, easing: SPRING });
      playOnce(ringRef.current, RING, { duration: 700, easing: EASE_OUT });
    }
    prev.current = count;
  }, [count]);

  const safe = Math.max(0, count);
  const over = safe > max;

  return (
    <button
      type="button"
      {...props}
      aria-label={safe > 0 ? `${label}, ${over ? `${max}+` : safe} ${unreadText}` : label}
      className={cx('motiv-badge', className)}
    >
      <span className="motiv-badge__icon" aria-hidden="true">
        {icon}
      </span>
      <span ref={badgeRef} className="motiv-badge__count" data-on={safe > 0} aria-hidden="true">
        <span ref={ringRef} className="motiv-badge__ring" />
        <Odometer value={over ? max : safe} />
        {over && '+'}
      </span>
    </button>
  );
}
