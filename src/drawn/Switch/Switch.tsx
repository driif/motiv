import { useId } from 'react';
import type { LiquidSwitchProps as SwitchProps } from '../../components/LiquidSwitch';
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
    <span className={cx('motiv-switch', className)} style={style}>
      <button
        type="button"
        {...props}
        id={switchId}
        role="switch"
        aria-checked={checked}
        className="motiv-switch__track"
        onClick={(event) => {
          onClick?.(event);
          if (event.defaultPrevented) return;
          onChange(!checked);
        }}
      >
        <svg className="motiv-switch__knob" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 3C6 2.5 2.5 7 3 12.5S7.5 21.5 12.5 21S21.5 16.5 21 11S16 2.5 10.5 3.5" />
        </svg>
      </button>
      <label htmlFor={switchId} className="motiv-switch__label">
        {label}
      </label>
    </span>
  );
}
