import {
  type ComponentProps,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
  useEffect,
  useId,
  useRef,
} from 'react';
import { cx } from '../../utils/cx';

export interface TabsProps extends Omit<ComponentProps<'div'>, 'onChange'> {
  items: { value: string; label: ReactNode; panel: ReactNode }[];
  value: string;
  onChange: (value: string) => void;
  label: string;
}

export function Tabs({ items, value, onChange, label, className, ...props }: TabsProps) {
  const id = useId();
  const index = items.findIndex((item) => item.value === value);
  const inkRef = useRef<HTMLSpanElement>(null);
  const prevIndex = useRef(index);

  useEffect(() => {
    if (prevIndex.current === index) return;
    prevIndex.current = index;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    inkRef.current?.animate?.(
      [
        { scale: '1 1' },
        { scale: '1.4 0.6', offset: 0.4 },
        { scale: '0.9 1.2', offset: 0.75 },
        { scale: '1 1' },
      ],
      { duration: 550, easing: 'ease-out' },
    );
  }, [index]);

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const last = items.length - 1;
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
    onChange(items[next].value);
    event.currentTarget.querySelectorAll<HTMLElement>('[role="tab"]')[next].focus();
  }

  return (
    <div className={cx('motiv-tabs', className)} {...props}>
      <div
        role="tablist"
        aria-label={label}
        className="motiv-tabs__list"
        style={{ '--_count': items.length, '--_index': index } as CSSProperties}
        onKeyDown={onKeyDown}
      >
        {items.map((item, i) => (
          <button
            key={item.value}
            type="button"
            role="tab"
            id={`${id}-tab-${i}`}
            aria-selected={i === index}
            aria-controls={`${id}-panel-${i}`}
            tabIndex={i === Math.max(index, 0) ? 0 : -1}
            className="motiv-tabs__tab"
            onClick={() => onChange(item.value)}
          >
            {item.label}
          </button>
        ))}
        <span ref={inkRef} className="motiv-tabs__ink" aria-hidden="true" />
      </div>
      {items.map((item, i) => (
        <div
          key={item.value}
          role="tabpanel"
          id={`${id}-panel-${i}`}
          aria-labelledby={`${id}-tab-${i}`}
          hidden={i !== index}
          tabIndex={0}
          className="motiv-tabs__panel"
        >
          {item.panel}
        </div>
      ))}
    </div>
  );
}
