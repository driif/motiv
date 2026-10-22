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
  const autoId = useId();
  const inputId = id ?? autoId;
  const hintId = `${inputId}-hint`;

  return (
    <div className={cx('motiv-float', className)}>
      <div className="motiv-float__control">
        <input
          {...props}
          id={inputId}
          type={type}
          placeholder=" "
          className="motiv-float__input"
          aria-describedby={cx(describedBy, hint ? hintId : undefined) || undefined}
        />
        <label htmlFor={inputId} className="motiv-float__label">
          {label}
        </label>
      </div>
      {hint && (
        <p id={hintId} className="motiv-float__hint">
          {hint}
        </p>
      )}
    </div>
  );
}
