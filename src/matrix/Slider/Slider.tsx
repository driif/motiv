import { type CSSProperties, useId } from 'react';
import type { SliderProps } from '../../drawn/Slider';
import { cx } from '../../utils/cx';

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
      className={cx('motiv-matrix-slider', className)}
      style={{ ...style, '--_p': percent(value) } as CSSProperties}
    >
      <div className="motiv-matrix-slider__head">
        <label className="motiv-matrix-slider__label" htmlFor={inputId}>
          {label}
        </label>
        <span className="motiv-matrix-slider__value" aria-hidden="true">
          {format(value)}
        </span>
      </div>
      <div className="motiv-matrix-slider__track">
        <span className="motiv-matrix-slider__bar" aria-hidden="true" />
        <input
          {...props}
          id={inputId}
          className="motiv-matrix-slider__input"
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
        <div className="motiv-matrix-slider__marks" aria-hidden="true">
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
