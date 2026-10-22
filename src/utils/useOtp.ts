import {
  type ChangeEvent,
  type ClipboardEvent,
  type FocusEvent,
  type KeyboardEvent,
  useEffect,
  useRef,
} from 'react';

/** One-time-code state: digit boxes that advance, step back, take a paste and report completion. */
export function useOtp({
  value,
  onChange,
  length,
  onComplete,
  disabled,
  digitLabel,
}: {
  value: string;
  onChange: (value: string) => void;
  length: number;
  onComplete?: (value: string) => void;
  disabled?: boolean;
  digitLabel: (index: number, length: number) => string;
}) {
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

  const inputProps = (i: number) => ({
    ref: (el: HTMLInputElement | null) => {
      refs.current[i] = el;
    },
    'data-filled': digits[i] ? '' : undefined,
    type: 'text',
    inputMode: 'numeric' as const,
    pattern: '[0-9]*',
    autoComplete: i === 0 ? 'one-time-code' : 'off',
    maxLength: i === 0 ? length : 1,
    'aria-label': digitLabel(i, length),
    value: digits[i] ?? '',
    disabled,
    onChange: (event: ChangeEvent<HTMLInputElement>) => {
      const typed = event.target.value.replace(/\D/g, '');
      if (!typed) return;
      if (typed.length > 1) {
        fill(i, typed);
        return;
      }
      const cur = latest.current;
      commit((cur.slice(0, i) + typed + cur.slice(i + 1)).slice(0, length));
      if (i < length - 1) focusAt(i + 1);
    },
    onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => {
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
    },
    onFocus: (event: FocusEvent<HTMLInputElement>) => {
      // Never leave a gap: focus lands on the first empty box at most.
      if (i > latest.current.length) focusAt(latest.current.length);
      else event.target.select();
    },
    onPaste: (event: ClipboardEvent<HTMLInputElement>) => {
      event.preventDefault();
      fill(Math.min(i, latest.current.length), event.clipboardData.getData('text'));
    },
  });

  return { refs, inputProps };
}
