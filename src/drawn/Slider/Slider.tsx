import { type CSSProperties, useId } from 'react';
import type { MomentumSliderProps as SliderProps } from '../../components/MomentumSlider';
import { cx } from '../../utils/cx';

const LINE = 'M2 7C60 3 120 10 180 6S270 4 298 7';

export function Slider({
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
}: SliderProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const range = max - min || 1;
  const percent = (v: number) => (((v - min) / range) * 100).toFixed(2);
  return (
    <div
      className={cx('motiv-slider', className)}
      style={{ ...style, '--_p': percent(value) } as CSSProperties}
    >
      <div className="motiv-slider__head">
        <label className="motiv-slider__label" htmlFor={inputId}>
          {label}
        </label>
        <span className="motiv-slider__value" aria-hidden="true">
          {format(value)}
        </span>
      </div>
      <div className="motiv-slider__track">
        <svg
          className="motiv-slider__rail"
          viewBox="0 0 300 12"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d={LINE} />
          <path className="motiv-slider__ink" pathLength={100} d={LINE} />
        </svg>
        <input
          {...props}
          id={inputId}
          className="motiv-slider__input"
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          aria-valuetext={format(value)}
          onChange={(event) => onChange(Number(event.target.value))}
        />
      </div>
      {marks && marks.length > 0 && (
        <div className="motiv-slider__marks" aria-hidden="true">
          {marks.map((mark) => (
            <span key={mark} style={{ '--_p': percent(mark) } as CSSProperties}>
              {format(mark)}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
