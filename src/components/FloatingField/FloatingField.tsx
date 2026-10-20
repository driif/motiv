import { type ComponentProps, useId } from 'react';
import { cx } from '../../utils/cx';
import { Icon } from '../../utils/Icon';

export interface FloatingFieldProps extends Omit<ComponentProps<'input'>, 'placeholder'> {
  label: string;
  hint?: string;
  /** Hide the validity check, e.g. for fields without constraints */
  showValidity?: boolean;
}

export function FloatingField({
  label,
  hint,
  showValidity = true,
  id,
  className,
  style,
  type = 'text',
  ...props
}: FloatingFieldProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const hintId = `${inputId}-hint`;

  return (
    <div className={cx('motiv-float', className)} style={style}>
      <div className="motiv-float__control">
        <input
          aria-describedby={hint ? hintId : undefined}
          {...props}
          id={inputId}
          type={type}
          placeholder=" "
          className="motiv-float__input"
        />
        <label htmlFor={inputId} className="motiv-float__label">
          {label}
        </label>
        {showValidity && (
          <Icon className="motiv-float__ok">
            <path d="M5 12.5l4.5 4.5L19 7.5" />
          </Icon>
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
