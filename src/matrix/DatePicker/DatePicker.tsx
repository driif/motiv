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
    <div className={cx('motiv-matrix-text-field motiv-matrix-date-picker', className)}>
      <label id={labelId} htmlFor={inputId} className="motiv-matrix-text-field__label">
        {label}
      </label>
      <div className="motiv-matrix-text-field__control">
        <span className="motiv-matrix-text-field__prompt" aria-hidden="true">
          &gt;
        </span>
        <input
          {...props}
          {...inputProps}
          id={inputId}
          type={type}
          className="motiv-matrix-text-field__input motiv-matrix-date-picker__input"
          disabled={disabled}
          readOnly={readOnly}
          aria-describedby={cx(describedBy, hint ? hintId : undefined) || undefined}
        />
        {filled && !disabled && !readOnly && (
          <button
            id={clearId}
            type="button"
            className="motiv-matrix-date-picker__clear"
            aria-labelledby={`${clearId} ${labelId}`}
            onClick={clear}
          >
            <span className="motiv-visually-hidden">{clearLabel}</span>
            <span aria-hidden="true">[×]</span>
          </button>
        )}
      </div>
      {hint && (
        <p id={hintId} className="motiv-matrix-text-field__hint">
          {hint}
        </p>
      )}
    </div>
  );
}
