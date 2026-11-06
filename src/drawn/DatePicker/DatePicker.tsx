import { useId } from 'react';
import type { DatePickerProps } from '../../components/DatePicker';
import { cx } from '../../utils/cx';
import { useDatePicker } from '../../utils/useDatePicker';

export function DatePicker({
  type = 'date',
  label,
  hint,
  clearLabel = 'Clear',
  id,
  ref,
  className,
  value,
  defaultValue,
  disabled,
  readOnly,
  onChange,
  'aria-describedby': describedBy,
  ...props
}: DatePickerProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const labelId = `${inputId}-label`;
  const hintId = `${inputId}-hint`;
  const clearId = `${inputId}-clear`;
  const { filled, inputProps, clear } = useDatePicker({ ref, value, defaultValue, onChange });

  return (
    <div className={cx('motiv-text-field motiv-sketch-date-picker', className)}>
      <div className="motiv-text-field__control">
        {/* Date inputs never match :placeholder-shown, so the TextField label stays lifted. */}
        <input
          {...props}
          {...inputProps}
          id={inputId}
          type={type}
          className="motiv-text-field__input motiv-sketch-date-picker__input"
          disabled={disabled}
          readOnly={readOnly}
          aria-describedby={cx(describedBy, hint ? hintId : undefined) || undefined}
        />
        <label id={labelId} htmlFor={inputId} className="motiv-text-field__label">
          {label}
        </label>
        <svg
          className="motiv-text-field__line"
          viewBox="0 0 300 12"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path pathLength={1} d="M2 7C60 3 120 10 180 6S270 4 298 7" />
        </svg>
        {filled && !disabled && !readOnly && (
          <button
            id={clearId}
            type="button"
            className="motiv-sketch-date-picker__clear"
            aria-labelledby={`${clearId} ${labelId}`}
            onClick={clear}
          >
            <span className="motiv-visually-hidden">{clearLabel}</span>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M7 6.5c3.5 3.8 6.8 7.4 10 11M17.5 6.5c-3.8 3.6-7.2 7.2-10.5 11" />
            </svg>
          </button>
        )}
      </div>
      {hint && (
        <p id={hintId} className="motiv-text-field__hint">
          {hint}
        </p>
      )}
    </div>
  );
}
