import { type ComponentProps, useEffect, useRef } from 'react';
import { cx } from '../../utils/cx';
import { mergeRefs } from '../../utils/mergeRefs';
import { prefersReducedMotion } from '../../utils/motion';

export interface MagneticButtonProps extends ComponentProps<'button'> {
  /** How strongly the button follows the cursor, 0–0.5. */
  strength?: number;
}

export function MagneticButton({
  strength = 0.22,
  className,
  style,
  children,
  ref,
  ...props
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const rect = useRef<DOMRect | null>(null);
  const frame = useRef(0);

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  const reset = () => {
    cancelAnimationFrame(frame.current);
    rect.current = null;
    if (buttonRef.current) buttonRef.current.style.translate = '';
    if (labelRef.current) labelRef.current.style.translate = '';
  };

  return (
    <span
      className={cx('motiv-magnet', className)}
      style={style}
      onPointerEnter={(event) => {
        if (event.pointerType !== 'mouse' || prefersReducedMotion()) return;
        rect.current = event.currentTarget.getBoundingClientRect();
      }}
      onPointerMove={(event) => {
        const r = rect.current;
        if (!r) return;
        const x = event.clientX - r.left - r.width / 2;
        const y = event.clientY - r.top - r.height / 2;
        cancelAnimationFrame(frame.current);
        frame.current = requestAnimationFrame(() => {
          if (buttonRef.current) {
            buttonRef.current.style.translate = `${x * strength}px ${y * strength * 1.35}px`;
          }
          if (labelRef.current) {
            labelRef.current.style.translate = `${x * strength * 0.35}px ${y * strength * 0.45}px`;
          }
        });
      }}
      onPointerLeave={reset}
    >
      <button
        type="button"
        {...props}
        ref={mergeRefs(buttonRef, ref)}
        className="motiv-magnet__button"
      >
        <span ref={labelRef} className="motiv-magnet__label">
          <span className="motiv-magnet__dot" aria-hidden="true" />
          {children}
        </span>
      </button>
    </span>
  );
}
