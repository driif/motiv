import { type ComponentProps, useEffect, useRef } from 'react';
import { cx } from '../../utils/cx';
import { EASE_OUT, playOnce, SPRING } from '../../utils/motion';
import { Odometer } from '../Odometer/Odometer';

const POP: Keyframe[] = [{ scale: '0.6' }, { scale: '1.3', offset: 0.5 }, { scale: '1' }];
const SPARK: Keyframe[] = [
  { opacity: 1, translate: '0 -8px', scale: '0.4' },
  { opacity: 0, translate: '0 -30px', scale: '1' },
];
const SPARKS = [0, 60, 120, 180, 240, 300];

export interface LikeButtonProps extends Omit<ComponentProps<'button'>, 'onToggle' | 'children'> {
  liked: boolean;
  /** Count to display, including the user's own like. */
  count: number;
  onToggle: (liked: boolean) => void;
  label?: string;
  minDigits?: number;
}

export function LikeButton({
  liked,
  count,
  onToggle,
  label = 'Like',
  minDigits = 1,
  className,
  onClick,
  ...props
}: LikeButtonProps) {
  const heartRef = useRef<SVGSVGElement>(null);
  const burstRef = useRef<HTMLSpanElement>(null);
  const prev = useRef(liked);

  useEffect(() => {
    if (liked && !prev.current) {
      playOnce(heartRef.current, POP, { duration: 500, easing: SPRING });
      for (const spark of burstRef.current?.querySelectorAll('i') ?? []) {
        playOnce(spark, SPARK, { duration: 600, easing: EASE_OUT });
      }
    }
    prev.current = liked;
  }, [liked]);

  return (
    <button
      type="button"
      {...props}
      aria-pressed={liked}
      aria-label={`${label}, ${count}`}
      className={cx('motiv-like', className)}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) onToggle(!liked);
      }}
    >
      <span ref={burstRef} className="motiv-like__burst" aria-hidden="true">
        {SPARKS.map((deg) => (
          <b key={deg} style={{ rotate: `${deg}deg` }}>
            <i />
          </b>
        ))}
      </span>
      <svg ref={heartRef} className="motiv-like__heart" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 20s-7-4.4-9-9.2C1.6 7.4 3.9 4.5 7 4.5c2 0 3.6 1.1 5 3 1.4-1.9 3-3 5-3 3.1 0 5.4 2.9 4 6.3C19 15.6 12 20 12 20z" />
      </svg>
      <Odometer className="motiv-like__count" value={count} minDigits={minDigits} />
    </button>
  );
}
