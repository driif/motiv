import { type ComponentProps, type ReactNode, useId, useRef } from 'react';
import { cx } from '../../utils/cx';
import { EASE_OUT, playOnce } from '../../utils/motion';

const STRETCH: Keyframe[] = [
  { scale: '1 1' },
  { scale: '1.45 0.82', offset: 0.35 },
  { scale: '0.95 1.05', offset: 0.7 },
  { scale: '1 1' },
];

export interface LiquidSwitchProps
  extends Omit<ComponentProps<'button'>, 'onChange' | 'children' | 'role'> {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: ReactNode;
}

export function LiquidSwitch({
  checked,
  onChange,
  label,
  id,
  className,
  style,
  onClick,
  ...props
}: LiquidSwitchProps) {
  const autoId = useId();
  const switchId = id ?? autoId;
  const blobRef = useRef<HTMLSpanElement>(null);

  return (
    <span className={cx('motiv-liquid', className)} style={style}>
      <button
        type="button"
        {...props}
        id={switchId}
        role="switch"
        aria-checked={checked}
        className="motiv-liquid__track"
        onClick={(event) => {
          onClick?.(event);
          if (event.defaultPrevented) return;
          playOnce(blobRef.current, STRETCH, { duration: 550, easing: EASE_OUT });
          onChange(!checked);
        }}
      >
        <span className="motiv-liquid__traveler" aria-hidden="true">
          <span ref={blobRef} className="motiv-liquid__blob" />
        </span>
      </button>
      <label htmlFor={switchId} className="motiv-liquid__label">
        {label}
      </label>
    </span>
  );
}
