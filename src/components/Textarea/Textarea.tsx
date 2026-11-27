import { type ComponentProps, type CSSProperties, useId } from 'react';
import { cx } from '../../utils/cx';
import { fitHeight, useFitHeight } from '../../utils/fitHeight';

export interface TextareaProps extends ComponentProps<'textarea'> {
  label: string;
  /** Keep the label for screen readers only */
  hideLabel?: boolean;
  hint?: string;
  /** Rows the field grows to before its content scrolls */
  maxRows?: number;
}

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
  const autoId = useId();
  const inputId = id ?? autoId;
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
      </div>
      {hint && (
        <p id={hintId} className="motiv-textarea__hint">
          {hint}
        </p>
      )}
    </div>
  );
}
