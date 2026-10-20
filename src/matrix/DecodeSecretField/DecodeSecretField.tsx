import { type ComponentProps, type ReactNode, useEffect, useId, useRef, useState } from 'react';
import { cx } from '../../utils/cx';
import { prefersReducedMotion } from '../../utils/motion';

export interface DecodeSecretFieldProps
  extends Omit<ComponentProps<'input'>, 'type' | 'value' | 'onChange'> {
  label: ReactNode;
  value: string;
  onChange: (value: string) => void;
  showLabel?: string;
  hideLabel?: string;
}

const GLYPHS = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#%&@$';
const FRAME_MS = 45;
const REVEAL_FRAMES = 16;
const HIDE_FRAMES = 8;

const scramble = (secret: string, keep: number) =>
  Array.from(secret, (ch, i) =>
    i < keep ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
  ).join('');

export function DecodeSecretField({
  label,
  value,
  onChange,
  showLabel = 'Show secret',
  hideLabel = 'Hide secret',
  id,
  className,
  style,
  readOnly,
  autoComplete = 'off',
  ...props
}: DecodeSecretFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const [shown, setShown] = useState(false);
  const [frame, setFrame] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setInterval>>(undefined);

  useEffect(() => () => clearInterval(timer.current), []);

  function toggle() {
    clearInterval(timer.current);
    const reveal = !shown;
    setShown(reveal);
    if (!value || prefersReducedMotion()) {
      setFrame(null);
      return;
    }
    const total = reveal ? REVEAL_FRAMES : HIDE_FRAMES;
    let step = 0;
    setFrame(scramble(value, 0));
    timer.current = setInterval(() => {
      step += 1;
      if (step >= total) {
        clearInterval(timer.current);
        setFrame(null);
        return;
      }
      setFrame(scramble(value, reveal ? Math.floor((step / total) * value.length) : 0));
    }, FRAME_MS);
  }

  const busy = frame !== null;

  return (
    <div className={cx('motiv-matrix-decode', className)} style={style}>
      <label htmlFor={inputId} className="motiv-matrix-decode__label">
        {label}
      </label>
      <div className="motiv-matrix-decode__box">
        <input
          {...props}
          id={inputId}
          className={cx('motiv-matrix-decode__input', busy && 'motiv-matrix-decode__input--busy')}
          type={shown && !busy ? 'text' : 'password'}
          value={busy ? '' : value}
          readOnly={busy || readOnly}
          autoComplete={autoComplete}
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          onChange={(event) => onChange(event.target.value)}
        />
        {/* The scramble paints over the emptied, masked input, so the plain value stays out of the DOM. */}
        {busy && (
          <span className="motiv-matrix-decode__scramble" aria-hidden="true">
            {frame}
          </span>
        )}
        <button
          type="button"
          className={cx('motiv-matrix-decode__eye', shown && 'motiv-matrix-decode__eye--shown')}
          aria-label={shown ? hideLabel : showLabel}
          aria-pressed={shown}
          aria-controls={inputId}
          disabled={props.disabled}
          onClick={toggle}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
            <circle className="motiv-matrix-decode__pupil" cx="12" cy="12" r="3" />
            <path className="motiv-matrix-decode__slash" d="M4 4l16 16" />
          </svg>
        </button>
      </div>
    </div>
  );
}
