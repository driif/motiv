import {
  type ComponentProps,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
  useId,
} from 'react';
import type { MotivOption } from '../../types';
import { cx } from '../../utils/cx';

export interface HudTabsProps extends Omit<ComponentProps<'div'>, 'onChange'> {
  tabs: MotivOption[];
  value: string;
  onChange: (value: string) => void;
  label: string;
  panels?: Record<string, ReactNode>;
  showStatus?: boolean;
  targetLabel?: string;
  lockedLabel?: string;
}

const pad = (n: number) => String(n).padStart(2, '0');

export function HudTabs({
  tabs,
  value,
  onChange,
  label,
  panels,
  showStatus = true,
  targetLabel = 'TARGET',
  lockedLabel = 'LOCKED',
  className,
  ...props
}: HudTabsProps) {
  const id = useId();
  const index = Math.max(
    0,
    tabs.findIndex((tab) => tab.value === value),
  );

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const last = tabs.length - 1;
    let next: number;
    switch (event.key) {
      case 'ArrowLeft':
        next = index <= 0 ? last : index - 1;
        break;
      case 'ArrowRight':
        next = index >= last ? 0 : index + 1;
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
    <div {...props} className={cx('motiv-matrix-hudtabs', className)}>
      <div
        role="tablist"
        aria-label={label}
        className="motiv-matrix-hudtabs__list"
        style={{ '--_count': tabs.length } as CSSProperties}
        onKeyDown={onKeyDown}
      >
        <span
          className="motiv-matrix-hudtabs__target"
          style={{ transform: `translateX(${index * 100}%)` }}
          aria-hidden="true"
        >
          <span className="motiv-matrix-hudtabs__corner motiv-matrix-hudtabs__corner--tl" />
          <span className="motiv-matrix-hudtabs__corner motiv-matrix-hudtabs__corner--tr" />
          <span className="motiv-matrix-hudtabs__corner motiv-matrix-hudtabs__corner--bl" />
          <span className="motiv-matrix-hudtabs__corner motiv-matrix-hudtabs__corner--br" />
        </span>
        {tabs.map((tab, i) => (
          <button
            key={tab.value}
            type="button"
            role="tab"
            id={`${id}-tab-${i}`}
            aria-selected={i === index}
            aria-controls={panels ? `${id}-panel-${i}` : undefined}
            tabIndex={i === index ? 0 : -1}
            className="motiv-matrix-hudtabs__tab"
            onClick={() => onChange(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {showStatus && tabs[index] && (
        <div className="motiv-matrix-hudtabs__status" aria-hidden="true">
          {targetLabel} {pad(index + 1)} / {pad(tabs.length)} · {tabs[index].label} {lockedLabel}
        </div>
      )}
      {panels &&
        tabs.map((tab, i) => (
          <div
            key={tab.value}
            id={`${id}-panel-${i}`}
            role="tabpanel"
            aria-labelledby={`${id}-tab-${i}`}
            tabIndex={0}
            hidden={i !== index}
            className="motiv-matrix-hudtabs__panel"
          >
            {panels[tab.value]}
          </div>
        ))}
    </div>
  );
}
