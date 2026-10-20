import { type ComponentProps, type ReactNode, useLayoutEffect, useRef } from 'react';
import { cx } from '../../utils/cx';
import { Icon } from '../../utils/Icon';
import { playOnce, SPRING } from '../../utils/motion';

const IN: Keyframe[] = [
  { opacity: 0.4, translate: '18px 0', rotate: '2deg' },
  { opacity: 1, translate: '0 0', rotate: '0deg' },
];
const OUT: Keyframe[] = [
  { opacity: 0.4, translate: '-14px 8px', rotate: '-2deg' },
  { opacity: 1, translate: '0 0', rotate: '0deg' },
];

export interface DrillLevel {
  id: string;
  name: string;
  meta?: ReactNode;
}

export interface DrillStackProps extends ComponentProps<'div'> {
  /** Levels from the root down to the one being shown. */
  path: DrillLevel[];
  /** Called with the depth of the clicked breadcrumb (0 = root). */
  onNavigate: (depth: number) => void;
  /** Opens the next level; the arrow is hidden when omitted. */
  onDrill?: () => void;
  canDrill?: boolean;
  drillLabel?: string;
  label?: string;
}

export function DrillStack({
  path,
  onNavigate,
  onDrill,
  canDrill = true,
  drillLabel = 'Open next level',
  label = 'Path',
  className,
  ...props
}: DrillStackProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const prevDepth = useRef(path.length);
  const current = path[path.length - 1];

  useLayoutEffect(() => {
    if (path.length !== prevDepth.current) {
      playOnce(cardRef.current, path.length > prevDepth.current ? IN : OUT, {
        duration: 450,
        easing: SPRING,
      });
    }
    prevDepth.current = path.length;
  }, [path.length]);

  if (!current) return null;

  return (
    <div {...props} className={cx('motiv-drill', className)}>
      <nav className="motiv-drill__crumbs" aria-label={label}>
        <ol>
          {path.slice(0, -1).map((level, depth) => (
            <li key={level.id}>
              <button
                type="button"
                className="motiv-drill__crumb"
                onClick={() => onNavigate(depth)}
              >
                {level.name}
              </button>
              <span className="motiv-drill__sep" aria-hidden="true">
                /
              </span>
            </li>
          ))}
          <li>
            <span className="motiv-drill__current" aria-current="page">
              {current.name}
            </span>
          </li>
        </ol>
      </nav>
      <div
        ref={cardRef}
        className={cx('motiv-drill__card', path.length > 1 && 'motiv-drill__card--stacked')}
      >
        <div className="motiv-drill__text">
          <b>{current.name}</b>
          {current.meta != null && <span>{current.meta}</span>}
        </div>
        {onDrill && (
          <button
            type="button"
            className="motiv-drill__next"
            aria-label={drillLabel}
            disabled={!canDrill}
            onClick={onDrill}
          >
            <Icon>
              <path d="M5 12h14M13 6l6 6-6 6" />
            </Icon>
          </button>
        )}
      </div>
    </div>
  );
}
