import { type CSSProperties, useId } from 'react';
import type { TextareaProps } from '../../drawn/Textarea';
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
      className={cx('motiv-matrix-textarea', className)}
      style={{ ...style, '--_max-rows': maxRows } as CSSProperties}
    >
      <label
        htmlFor={inputId}
        className={cx('motiv-matrix-textarea__label', hideLabel && 'motiv-visually-hidden')}
      >
        {label}
      </label>
      <div
        ref={control}
        className="motiv-matrix-textarea__control"
        onInput={(event) => fitHeight(event.target as HTMLTextAreaElement)}
      >
        <span className="motiv-matrix-textarea__prompt" aria-hidden="true">
          &gt;
        </span>
        <textarea
          aria-describedby={hint ? hintId : undefined}
          {...props}
          id={inputId}
          className="motiv-matrix-textarea__input"
        />
      </div>
      {hint && (
        <p id={hintId} className="motiv-matrix-textarea__hint">
          {hint}
        </p>
      )}
    </div>
  );
}
