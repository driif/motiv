import type { CSSProperties } from 'react';
import type { SegmentedControlProps } from '../../components/SegmentedControl';
import { cx } from '../../utils/cx';
import { useRadioGroupKeys } from '../../utils/useRadioGroupKeys';

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
  const hasHints = options.some((option) => option.hint != null);
  const onKeyDown = useRadioGroupKeys({ options, index, onChange, onKeyDown: onKeyDownProp });

  return (
    <div
      {...props}
      role="radiogroup"
      aria-label={label}
      className={cx('motiv-matrix-segmented', className)}
      onKeyDown={onKeyDown}
    >
      <div
        className="motiv-matrix-segmented__track"
        style={{ '--_count': options.length, '--_index': Math.max(index, 0) } as CSSProperties}
      >
        <span className="motiv-matrix-segmented__marker" aria-hidden="true" />
        {options.map((option, i) => (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={i === index}
            tabIndex={i === Math.max(index, 0) ? 0 : -1}
            className="motiv-matrix-segmented__option"
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
      {hasHints && (
        <div className="motiv-matrix-segmented__hints" aria-live="polite">
          {options.map((option, i) => (
            <span
              key={option.value}
              className="motiv-matrix-segmented__hint"
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
