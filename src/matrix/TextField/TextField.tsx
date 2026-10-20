import { useId } from 'react';
import type { TextFieldProps } from '../../drawn/TextField';
import { cx } from '../../utils/cx';

export function TextField({
  label,
  hint,
  id,
  type = 'text',
  className,
  'aria-describedby': describedBy,
  ...props
}: TextFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const hintId = `${inputId}-hint`;
  return (
    <div className={cx('motiv-matrix-text-field', className)}>
      <label htmlFor={inputId} className="motiv-matrix-text-field__label">
        {label}
      </label>
      <div className="motiv-matrix-text-field__control">
        <span className="motiv-matrix-text-field__prompt" aria-hidden="true">
          &gt;
        </span>
        <input
          {...props}
          id={inputId}
          type={type}
          className="motiv-matrix-text-field__input"
          aria-describedby={cx(describedBy, hint ? hintId : undefined) || undefined}
        />
      </div>
      {hint && (
        <p id={hintId} className="motiv-matrix-text-field__hint">
          {hint}
        </p>
      )}
    </div>
  );
}
