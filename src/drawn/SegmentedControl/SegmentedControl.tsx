import { type ComponentProps, type CSSProperties, useEffect, useRef } from 'react';
import type { MotivOption } from '../../types';
import { cx } from '../../utils/cx';
import { useRadioGroupKeys } from '../../utils/useRadioGroupKeys';

export interface SegmentedControlProps extends Omit<ComponentProps<'div'>, 'onChange'> {
  options: MotivOption[];
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
  onKeyDown: onKeyDownProp,
  ...props
}: SegmentedControlProps) {
  const index = options.findIndex((option) => option.value === value);
  const blobRef = useRef<HTMLSpanElement>(null);
  const prevIndex = useRef(index);
  const hasHints = options.some((option) => option.hint != null);
  const onKeyDown = useRadioGroupKeys({ options, index, onChange, onKeyDown: onKeyDownProp });

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

  return (
    <div
      {...props}
      role="radiogroup"
      aria-label={label}
      className={cx('motiv-segmented', className)}
      onKeyDown={onKeyDown}
    >
      <div
        className="motiv-segmented__track"
        style={{ '--_count': options.length, '--_index': index } as CSSProperties}
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
      {hasHints && (
        <div className="motiv-segmented__hints" aria-live="polite">
          {options.map((option, i) => (
            <span
              key={option.value}
              className="motiv-segmented__hint"
              data-active={i === index}
              aria-hidden={i !== index}
            >
              {option.hint}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
