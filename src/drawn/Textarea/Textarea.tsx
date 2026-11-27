import { type CSSProperties, useId } from 'react';
import type { TextareaProps } from '../../components/Textarea';
import { cx } from '../../utils/cx';
import { fitHeight, useFitHeight } from '../../utils/fitHeight';

export function Textarea({
  label,
  hideLabel = false,
  hint,
  maxRows = 8,
  id,
  className,
  style,
  ...props
}: TextareaProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const hintId = `${inputId}-hint`;
  const control = useFitHeight();

  return (
    <div
      className={cx('motiv-textarea', className)}
      style={{ ...style, '--_max-rows': maxRows } as CSSProperties}
    >
      <label
        htmlFor={inputId}
        className={cx('motiv-textarea__label', hideLabel && 'motiv-visually-hidden')}
      >
        {label}
      </label>
      <div
        ref={control}
        className="motiv-textarea__control"
        onInput={(event) => fitHeight(event.target as HTMLTextAreaElement)}
      >
        <textarea
          aria-describedby={hint ? hintId : undefined}
          {...props}
          id={inputId}
          className="motiv-textarea__input"
        />
        <svg
          className="motiv-textarea__line"
          viewBox="0 0 300 12"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path pathLength={1} d="M2 7C60 3 120 10 180 6S270 4 298 7" />
        </svg>
      </div>
      {hint && (
        <p id={hintId} className="motiv-textarea__hint">
          {hint}
        </p>
      )}
    </div>
  );
}
