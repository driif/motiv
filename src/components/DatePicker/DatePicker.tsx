import { type ComponentProps, type ReactNode, useId } from 'react';
import { cx } from '../../utils/cx';
import { Icon } from '../../utils/Icon';
import { useDatePicker } from '../../utils/useDatePicker';

export interface DatePickerProps extends Omit<ComponentProps<'input'>, 'placeholder' | 'type'> {
  /** `'date'` posts `YYYY-MM-DD`, `'datetime-local'` posts `YYYY-MM-DDTHH:mm` without a timezone. */
  type?: 'date' | 'datetime-local';
  label: ReactNode;
  hint?: ReactNode;
  /** Clear button text, announced as "<clearLabel> <label>". */
  clearLabel?: string;
}

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
    <div className={cx('motiv-float motiv-date-picker', className)}>
      <div className="motiv-float__control">
        <input
          {...props}
          {...inputProps}
          id={inputId}
          type={type}
          className="motiv-float__input"
          disabled={disabled}
          readOnly={readOnly}
          aria-describedby={cx(describedBy, hint ? hintId : undefined) || undefined}
        />
        <label id={labelId} htmlFor={inputId} className="motiv-float__label">
          {label}
        </label>
        {filled && !disabled && !readOnly && (
          <button
            id={clearId}
            type="button"
            className="motiv-date-picker__clear"
            aria-labelledby={`${clearId} ${labelId}`}
            onClick={clear}
          >
            <span className="motiv-visually-hidden">{clearLabel}</span>
            <Icon>
              <path d="M7 7l10 10M17 7L7 17" />
            </Icon>
          </button>
        )}
      </div>
      {hint && (
        <p id={hintId} className="motiv-float__hint">
          {hint}
        </p>
      )}
    </div>
  );
}
