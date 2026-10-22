import type { KeyboardEvent } from 'react';

/** Arrow keys move a radiogroup's selection and focus, wrapping; the caller's `onKeyDown` runs first. */
export function useRadioGroupKeys({
  options,
  index,
  onChange,
  onKeyDown,
}: {
  options: { value: string }[];
  index: number;
  onChange: (value: string) => void;
  onKeyDown?: (event: KeyboardEvent<HTMLDivElement>) => void;
}) {
  return (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    const last = options.length - 1;
    let next: number;
    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowUp':
        next = index <= 0 ? last : index - 1;
        break;
      case 'ArrowRight':
      case 'ArrowDown':
        next = index >= last ? 0 : index + 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    onChange(options[next].value);
    event.currentTarget.querySelectorAll<HTMLElement>('[role="radio"]')[next].focus();
  };
}
