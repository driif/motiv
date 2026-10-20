import {
  type ComponentProps,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
  useEffect,
  useRef,
} from 'react';
import { cx } from '../../utils/cx';

export interface SegmentedControlProps extends Omit<ComponentProps<'div'>, 'onChange'> {
  options: { value: string; label: ReactNode }[];
  value: string;
  onChange: (value: string) => void;
  label: string;
}

export function SegmentedControl({
  options,
  value,
  onChange,
  label,
  className,
  style,
  onKeyDown: onKeyDownProp,
  ...props
}: SegmentedControlProps) {
  const index = options.findIndex((option) => option.value === value);
  const blobRef = useRef<HTMLSpanElement>(null);
  const prevIndex = useRef(index);

  useEffect(() => {
    if (prevIndex.current === index) return;
    prevIndex.current = index;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    blobRef.current?.animate?.(
      [
        { scale: '1 1' },
        { scale: '1.3 0.78', offset: 0.35 },
        { scale: '0.92 1.06', offset: 0.7 },
        { scale: '1 1' },
      ],
      { duration: 600, easing: 'ease-out' },
    );
  }, [index]);

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    onKeyDownProp?.(event);
    if (event.defaultPrevented) return;
    const last = options.length - 1;
    let next: number;
    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowUp':
        next = index <= 0 ? last : index - 1;
        break;
      case 'ArrowRight':
      case 'ArrowDown':
        next = index >= last ? 0 : index + 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    onChange(options[next].value);
    event.currentTarget.querySelectorAll<HTMLElement>('[role="radio"]')[next].focus();
  }

  return (
    <div
      {...props}
      role="radiogroup"
      aria-label={label}
      className={cx('motiv-segmented', className)}
      style={{ ...style, '--_count': options.length, '--_index': index } as CSSProperties}
      onKeyDown={onKeyDown}
    >
      <span ref={blobRef} className="motiv-segmented__blob" aria-hidden="true" />
      {options.map((option, i) => (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={i === index}
          tabIndex={i === Math.max(index, 0) ? 0 : -1}
          className="motiv-segmented__option"
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
