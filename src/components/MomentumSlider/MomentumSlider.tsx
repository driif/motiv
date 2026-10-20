import {
  type ChangeEvent,
  type ComponentProps,
  type CSSProperties,
  useEffect,
  useId,
  useRef,
} from 'react';
import { cx } from '../../utils/cx';
import { prefersReducedMotion } from '../../utils/motion';

export interface MomentumSliderProps
  extends Omit<ComponentProps<'input'>, 'type' | 'value' | 'onChange' | 'min' | 'max' | 'step'> {
  value: number;
  onChange: (value: number) => void;
  label: string;
  min?: number;
  max?: number;
  step?: number;
  format?: (value: number) => string;
  /** Values to label under the track */
  marks?: number[];
}

export function MomentumSlider({
  value,
  onChange,
  label,
  min = 0,
  max = 100,
  step = 1,
  format = String,
  marks,
  className,
  style,
  id,
  ...props
}: MomentumSliderProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const valueRef = useRef<HTMLSpanElement>(null);
  const frame = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const range = max - min || 1;
  const pct = (((value - min) / range) * 100).toFixed(2);

  useEffect(
    () => () => {
      cancelAnimationFrame(frame.current);
      clearTimeout(timer.current);
    },
    [],
  );

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const next = Number(event.target.value);
    const el = valueRef.current;
    if (el && !prefersReducedMotion()) {
      const tilt = Math.min(26, Math.max(-26, (-(next - value) / range) * 280));
      cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => {
        el.style.rotate = `${tilt}deg`;
      });
      clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        el.style.rotate = '';
      }, 120);
    }
    onChange(next);
  }

  return (
    <div className={cx('motiv-momentum', className)} style={style}>
      <label className="motiv-momentum__label" htmlFor={inputId}>
        {label}
      </label>
      <div className="motiv-momentum__track" style={{ '--_p': pct } as CSSProperties}>
        <span className="motiv-momentum__rail" aria-hidden="true">
          <span className="motiv-momentum__bubble">
            <span ref={valueRef} className="motiv-momentum__value">
              {format(value)}
            </span>
          </span>
        </span>
        <input
          {...props}
          id={inputId}
          className="motiv-range"
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          aria-valuetext={format(value)}
          onChange={handleChange}
        />
      </div>
      {marks && marks.length > 0 && (
        <div className="motiv-momentum__marks" aria-hidden="true">
          {marks.map((mark) => (
            <span
              key={mark}
              style={{ '--_p': (((mark - min) / range) * 100).toFixed(2) } as CSSProperties}
            >
              {format(mark)}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
