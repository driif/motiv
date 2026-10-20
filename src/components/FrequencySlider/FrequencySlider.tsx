import { type ComponentProps, type CSSProperties, useId } from 'react';
import { cx } from '../../utils/cx';

const PATTERN = Array.from(
  { length: 21 },
  (_, i) => 0.55 + 0.45 * Math.abs(Math.sin(i * 1.7 + Math.cos(i * 0.6))),
);

export interface FrequencySliderProps
  extends Omit<ComponentProps<'input'>, 'type' | 'value' | 'onChange' | 'min' | 'max' | 'step'> {
  value: number;
  onChange: (value: number) => void;
  label: string;
  min?: number;
  max?: number;
  step?: number;
  format?: (value: number) => string;
}

export function FrequencySlider({
  value,
  onChange,
  label,
  min = 0,
  max = 100,
  step = 1,
  format = (v) => `${v}%`,
  className,
  style,
  id,
  ...props
}: FrequencySliderProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const v = max > min ? (value - min) / (max - min) : 0;

  return (
    <div className={cx('motiv-freq', className)} style={style}>
      <div className="motiv-freq__top">
        <label htmlFor={inputId}>{label}</label>
        <output htmlFor={inputId}>{format(value)}</output>
      </div>
      <div className="motiv-freq__bars" aria-hidden="true">
        {PATTERN.map((p, i) => {
          const pos = i / (PATTERN.length - 1);
          const swell = Math.exp(-((pos - v) ** 2) / 0.025);
          const scale = Math.min(1, 0.18 + (0.25 + 0.75 * v) * (0.35 + 0.65 * swell));
          return (
            <i
              // biome-ignore lint/suspicious/noArrayIndexKey: the bar pattern is fixed
              key={i}
              className="motiv-freq__bar"
              data-on={pos <= v || undefined}
              style={{ height: `${Math.round(40 * p)}px`, scale: `1 ${scale.toFixed(3)}` }}
            />
          );
        })}
      </div>
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
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ '--_p': (v * 100).toFixed(2) } as CSSProperties}
      />
    </div>
  );
}
