import { type ComponentProps, type CSSProperties, useEffect, useRef } from 'react';
import type { MotivOption } from '../../types';
import { cx } from '../../utils/cx';
import { EASE_OUT, playOnce } from '../../utils/motion';
import { useRadioGroupKeys } from '../../utils/useRadioGroupKeys';

const SQUASH: Keyframe[] = [
  { scale: '1 1' },
  { scale: '1.12 0.9', offset: 0.35 },
  { scale: '0.97 1.03', offset: 0.7 },
  { scale: '1 1' },
];

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
  const pillRef = useRef<HTMLSpanElement>(null);
  const prevIndex = useRef(index);
  const hasHints = options.some((option) => option.hint != null);

  useEffect(() => {
    if (prevIndex.current === index) return;
    prevIndex.current = index;
    playOnce(pillRef.current, SQUASH, { duration: 550, easing: EASE_OUT });
  }, [index]);

  const onKeyDown = useRadioGroupKeys({ options, index, onChange, onKeyDown: onKeyDownProp });

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
        style={{ '--_count': options.length, '--_index': Math.max(index, 0) } as CSSProperties}
      >
        <span className="motiv-segmented__traveler" aria-hidden="true">
          <span ref={pillRef} className="motiv-segmented__pill" />
        </span>
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
