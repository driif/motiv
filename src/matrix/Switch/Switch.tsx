import { useId } from 'react';
import type { SwitchProps } from '../../drawn/Switch';
import { cx } from '../../utils/cx';

export function Switch({
  checked,
  onChange,
  label,
  id,
  className,
  style,
  onClick,
  ...props
}: SwitchProps) {
  const generatedId = useId();
  const switchId = id ?? generatedId;
  return (
    <span className={cx('motiv-matrix-switch', className)} style={style}>
      <button
        type="button"
        {...props}
        id={switchId}
        role="switch"
        aria-checked={checked}
        className="motiv-matrix-switch__track"
        onClick={(event) => {
          onClick?.(event);
          if (event.defaultPrevented) return;
          onChange(!checked);
        }}
      >
        <span className="motiv-matrix-switch__state" aria-hidden="true" />
      </button>
      <label htmlFor={switchId} className="motiv-matrix-switch__label">
        {label}
      </label>
    </span>
  );
}
