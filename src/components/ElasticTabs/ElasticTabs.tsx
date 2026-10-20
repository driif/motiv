import {
  type ComponentProps,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
  useEffect,
  useId,
  useRef,
} from 'react';
import type { MotivOption } from '../../types';
import { cx } from '../../utils/cx';
import { EASE_OUT, playOnce } from '../../utils/motion';

const SETTLE: Keyframe[] = [
  { scale: '1 1' },
  { scale: '1.6 1', offset: 0.3 },
  { scale: '0.92 1', offset: 0.7 },
  { scale: '1 1' },
];

export interface ElasticTabsProps extends Omit<ComponentProps<'div'>, 'onChange'> {
  tabs: MotivOption[];
  value: string;
  onChange: (value: string) => void;
  label: string;
  panels?: Record<string, ReactNode>;
}

export function ElasticTabs({
  tabs,
  value,
  onChange,
  label,
  panels,
  className,
  ...props
}: ElasticTabsProps) {
  const id = useId();
  const index = Math.max(
    0,
    tabs.findIndex((tab) => tab.value === value),
  );
  const barRef = useRef<HTMLSpanElement>(null);
  const prevIndex = useRef(index);

  useEffect(() => {
    const prev = prevIndex.current;
    if (prev === index) return;
    prevIndex.current = index;
    const bar = barRef.current;
    // Anchored at the leading edge, the bar stretches back toward the tab it left.
    if (bar) bar.style.transformOrigin = index > prev ? 'right' : 'left';
    playOnce(bar, SETTLE, { duration: 500, easing: EASE_OUT });
  }, [index]);

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const last = tabs.length - 1;
    let next: number;
    switch (event.key) {
      case 'ArrowLeft':
        next = index === 0 ? last : index - 1;
        break;
      case 'ArrowRight':
        next = index === last ? 0 : index + 1;
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = last;
        break;
      default:
        return;
    }
    event.preventDefault();
    onChange(tabs[next].value);
    event.currentTarget.querySelectorAll<HTMLElement>('[role="tab"]')[next].focus();
  }

  return (
    <div {...props} className={cx('motiv-elastic-tabs', className)}>
      <div
        role="tablist"
        aria-label={label}
        className="motiv-elastic-tabs__list"
        style={{ '--_count': tabs.length, '--_index': index } as CSSProperties}
        onKeyDown={onKeyDown}
      >
        {tabs.map((tab, i) => (
          <button
            key={tab.value}
            type="button"
            role="tab"
            id={`${id}-tab-${i}`}
            aria-selected={i === index}
            aria-controls={panels ? `${id}-panel-${i}` : undefined}
            tabIndex={i === index ? 0 : -1}
            className="motiv-elastic-tabs__tab"
            onClick={() => onChange(tab.value)}
          >
            {tab.label}
          </button>
        ))}
        <span className="motiv-elastic-tabs__indicator" aria-hidden="true">
          <span ref={barRef} className="motiv-elastic-tabs__bar" />
        </span>
      </div>
      {panels && (
        <div className="motiv-elastic-tabs__panels">
          {tabs.map((tab, i) => (
            <div
              key={tab.value}
              role="tabpanel"
              id={`${id}-panel-${i}`}
              aria-labelledby={`${id}-tab-${i}`}
              tabIndex={i === index ? 0 : -1}
              data-position={i === index ? 'current' : i < index ? 'before' : 'after'}
              className="motiv-elastic-tabs__panel"
            >
              {panels[tab.value]}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
