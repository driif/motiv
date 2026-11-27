import { type ComponentProps, type ReactNode, useId } from 'react';
import { cx } from '../../utils/cx';

export interface TextFieldProps extends Omit<ComponentProps<'input'>, 'placeholder'> {
  label: ReactNode;
  hint?: ReactNode;
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
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const hintId = `${inputId}-hint`;
  const above = labelPosition === 'above';
  const labelElement = (
    <label
      htmlFor={inputId}
      className={
        labelPosition === 'hidden'
          ? 'motiv-visually-hidden'
          : above
            ? 'motiv-text-field__title'
            : 'motiv-text-field__label'
      }
    >
      {label}
    </label>
  );
  return (
    <div
      className={cx(
        'motiv-text-field',
        labelPosition !== 'float' && `motiv-text-field--${labelPosition}`,
        className,
      )}
    >
      {above && labelElement}
      <div className="motiv-text-field__control">
        {/* The blank placeholder lets CSS lift the label via :placeholder-shown. */}
        <input
          {...props}
          id={inputId}
          type={type}
          placeholder=" "
          className="motiv-text-field__input"
          aria-describedby={cx(describedBy, hint ? hintId : undefined) || undefined}
        />
        {!above && labelElement}
        <svg
          className="motiv-text-field__line"
          viewBox="0 0 300 12"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path pathLength={1} d="M2 7C60 3 120 10 180 6S270 4 298 7" />
        </svg>
      </div>
      {hint && (
        <p id={hintId} className="motiv-text-field__hint">
          {hint}
        </p>
      )}
    </div>
  );
}
