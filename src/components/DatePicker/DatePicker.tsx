import { type ComponentProps, type ReactNode, useEffect, useId, useRef, useState } from 'react';
import { cx } from '../../utils/cx';
import { Icon } from '../../utils/Icon';

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
  const input = useRef<HTMLInputElement>(null);
  const [hasValue, setHasValue] = useState(Boolean(defaultValue));
  const filled = value === undefined ? hasValue : value !== '';

  useEffect(() => {
    const node = input.current;
    const form = node?.form;
    if (!node || !form) return;
    const reset = () => {
      // form.reset() bypasses React's value tracker; assigning the default here keeps it in step.
      node.value = node.defaultValue;
      setHasValue(node.value !== '');
    };
    form.addEventListener('reset', reset);
    return () => form.removeEventListener('reset', reset);
  }, []);

  return (
    <div className={cx('motiv-float motiv-date-picker', className)}>
      <div className="motiv-float__control">
        <input
          {...props}
          id={inputId}
          ref={(node) => {
            input.current = node;
            if (typeof ref === 'function') return ref(node);
            if (ref) ref.current = node;
          }}
          type={type}
          className="motiv-float__input"
          value={value}
          defaultValue={defaultValue}
          disabled={disabled}
          readOnly={readOnly}
          aria-describedby={cx(describedBy, hint ? hintId : undefined) || undefined}
          onChange={(event) => {
            setHasValue(event.currentTarget.value !== '');
            onChange?.(event);
          }}
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
            onClick={() => {
              const node = input.current;
              if (!node) return;
              // The prototype setter bypasses React's value tracker, so the input event reads as a change.
              Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set?.call(
                node,
                '',
              );
              node.dispatchEvent(new Event('input', { bubbles: true }));
              node.focus();
            }}
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
