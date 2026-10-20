import {
  type ChangeEvent,
  type ClipboardEvent,
  type ComponentProps,
  type FocusEvent,
  type KeyboardEvent,
  useEffect,
  useRef,
} from 'react';
import { cx } from '../../utils/cx';
import { playOnce, SHAKE, SPRING } from '../../utils/motion';

const WAVE: Keyframe[] = [
  { translate: '0 0' },
  { translate: '0 -8px', offset: 0.4 },
  { translate: '0 0' },
];

export interface OtpInputProps extends Omit<ComponentProps<'fieldset'>, 'onChange'> {
  value: string;
  onChange: (value: string) => void;
  label: string;
  length?: number;
  onComplete?: (value: string) => void;
  /** Set after you verify the code: 'success' waves, 'error' shakes */
  status?: 'idle' | 'success' | 'error';
  disabled?: boolean;
  digitLabel?: (index: number, length: number) => string;
}

export function OtpInput({
  value,
  onChange,
  label,
  length = 6,
  onComplete,
  status = 'idle',
  disabled,
  digitLabel = (i, n) => `Digit ${i + 1} of ${n}`,
  className,
  ...props
}: OtpInputProps) {
  const groupRef = useRef<HTMLDivElement>(null);
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = value.replace(/\D/g, '').slice(0, length);
  // Focus moves before React re-renders, so handlers read the latest digits from here.
  const latest = useRef(digits);
  latest.current = digits;
  const completeRef = useRef(onComplete);
  completeRef.current = onComplete;

  useEffect(() => {
    if (digits.length === length) completeRef.current?.(digits);
  }, [digits, length]);

  useEffect(() => {
    if (status === 'success') {
      refs.current.forEach((el, i) => {
        playOnce(el, WAVE, { duration: 550, delay: i * 50, easing: SPRING });
      });
    } else if (status === 'error') {
      playOnce(groupRef.current, SHAKE, { duration: 420 });
    }
  }, [status]);

  const commit = (next: string) => {
    latest.current = next;
    onChange(next);
  };

  const focusAt = (i: number) => refs.current[Math.max(0, Math.min(length - 1, i))]?.focus();

  const fill = (from: number, text: string) => {
    const incoming = text.replace(/\D/g, '');
    if (!incoming) return;
    const next = (latest.current.slice(0, from) + incoming).slice(0, length);
    commit(next);
    focusAt(next.length >= length ? length - 1 : next.length);
  };

  const handleChange = (i: number) => (event: ChangeEvent<HTMLInputElement>) => {
    const typed = event.target.value.replace(/\D/g, '');
    if (!typed) return;
    if (typed.length > 1) {
      fill(i, typed);
      return;
    }
    const cur = latest.current;
    commit((cur.slice(0, i) + typed + cur.slice(i + 1)).slice(0, length));
    if (i < length - 1) focusAt(i + 1);
  };

  const handleKeyDown = (i: number) => (event: KeyboardEvent<HTMLInputElement>) => {
    const cur = latest.current;
    if (event.key === 'Backspace') {
      event.preventDefault();
      if (cur[i]) commit(cur.slice(0, i) + cur.slice(i + 1));
      else if (i > 0) {
        commit(cur.slice(0, i - 1) + cur.slice(i));
        focusAt(i - 1);
      }
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      focusAt(i - 1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      focusAt(Math.min(i + 1, cur.length));
    }
  };

  const handleFocus = (i: number) => (event: FocusEvent<HTMLInputElement>) => {
    // Never leave a gap: focus lands on the first empty box at most.
    if (i > latest.current.length) focusAt(latest.current.length);
    else event.target.select();
  };

  const handlePaste = (i: number) => (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    fill(Math.min(i, latest.current.length), event.clipboardData.getData('text'));
  };

  return (
    <fieldset {...props} className={cx('motiv-otp', className)} data-status={status}>
      <legend className="motiv-otp__label">{label}</legend>
      <div ref={groupRef} className="motiv-otp__boxes">
        {Array.from({ length }, (_, i) => (
          <input
            // biome-ignore lint/suspicious/noArrayIndexKey: boxes are positions, not items
            key={i}
            ref={(el) => {
              refs.current[i] = el;
            }}
            className="motiv-otp__box"
            data-filled={digits[i] ? '' : undefined}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete={i === 0 ? 'one-time-code' : 'off'}
            maxLength={i === 0 ? length : 1}
            aria-label={digitLabel(i, length)}
            value={digits[i] ?? ''}
            disabled={disabled}
            onChange={handleChange(i)}
            onKeyDown={handleKeyDown(i)}
            onFocus={handleFocus(i)}
            onPaste={handlePaste(i)}
          />
        ))}
      </div>
    </fieldset>
  );
}
