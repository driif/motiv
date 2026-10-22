import type { KeyboardEvent } from 'react';

/** Spinbutton stepping: spread `onKeyDown` on the value, call `bump` from the buttons. */
export function useStepper({
  value,
  onChange,
  min,
  max,
  step,
  onOutOfRange,
}: {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  onOutOfRange?: () => void;
}) {
  const decimals = Math.max(...[step, min, value].map((n) => String(n).split('.')[1]?.length ?? 0));

  function bump(delta: number) {
    // Rounded to the finest precision in play so 0.1 + 0.2 lands on 0.3.
    const next = Number((value + delta).toFixed(decimals));
    if (next < min || next > max) onOutOfRange?.();
    else onChange(next);
  }

  function onKeyDown(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowUp':
      case 'ArrowRight':
        bump(step);
        break;
      case 'ArrowDown':
      case 'ArrowLeft':
        bump(-step);
        break;
      case 'Home':
        onChange(min);
        break;
      case 'End':
        onChange(max);
        break;
      default:
        return;
    }
    event.preventDefault();
  }

  return { decimals, bump, onKeyDown };
}
