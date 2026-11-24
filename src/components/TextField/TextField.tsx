import { useId } from 'react';
import type { TextFieldProps as BaseTextFieldProps } from '../../drawn/TextField';
import { cx } from '../../utils/cx';

export interface TextFieldProps extends BaseTextFieldProps {
  /**
   * `above` puts the label over a field-height box, like Select's label. `hidden` keeps the
   * label for screen readers only and makes a row-height box, e.g. for inline edit.
   */
  labelPosition?: 'float' | 'above' | 'hidden';
}

export function TextField({
  label,
  hint,
  labelPosition = 'float',
  id,
  type = 'text',
  className,
  'aria-describedby': describedBy,
  ...props
}: TextFieldProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const hintId = `${inputId}-hint`;
  const above = labelPosition === 'above';
  const labelElement = (
    <label
      htmlFor={inputId}
      className={
        labelPosition === 'hidden'
          ? 'motiv-visually-hidden'
          : above
            ? 'motiv-float__title'
            : 'motiv-float__label'
      }
    >
      {label}
    </label>
  );

  return (
    <div
      className={cx(
        'motiv-float',
        labelPosition !== 'float' && `motiv-float--${labelPosition}`,
        className,
      )}
    >
      {above && labelElement}
      <div className="motiv-float__control">
        <input
          {...props}
          id={inputId}
          type={type}
          placeholder=" "
          className="motiv-float__input"
          aria-describedby={cx(describedBy, hint ? hintId : undefined) || undefined}
        />
        {!above && labelElement}
      </div>
      {hint && (
        <p id={hintId} className="motiv-float__hint">
          {hint}
        </p>
      )}
    </div>
  );
}
