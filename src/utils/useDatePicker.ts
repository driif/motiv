import { type ChangeEvent, type RefCallback, useEffect, useRef, useState } from 'react';
import type { DatePickerProps } from '../components/DatePicker';

/** Native date input state: whether it holds a value, form-reset tracking and a one-click clear. */
export function useDatePicker({
  ref,
  value,
  defaultValue,
  onChange,
}: Pick<DatePickerProps, 'ref' | 'value' | 'defaultValue' | 'onChange'>) {
  const input = useRef<HTMLInputElement>(null);
  const [hasValue, setHasValue] = useState(Boolean(defaultValue));

  useEffect(() => {
    const node = input.current;
    const form = node?.form;
    if (!node || !form) return;
    const reset = () => {
      // form.reset() bypasses React's value tracker; assigning the default here keeps it in step.
      node.value = node.defaultValue;
      setHasValue(node.value !== '');
    };
    form.addEventListener('reset', reset);
    return () => form.removeEventListener('reset', reset);
  }, []);

  const inputRef: RefCallback<HTMLInputElement> = (node) => {
    input.current = node;
    if (typeof ref === 'function') return ref(node);
    if (ref) ref.current = node;
  };

  return {
    filled: value === undefined ? hasValue : value !== '',
    inputProps: {
      ref: inputRef,
      value,
      defaultValue,
      onChange: (event: ChangeEvent<HTMLInputElement>) => {
        setHasValue(event.currentTarget.value !== '');
        onChange?.(event);
      },
    },
    clear() {
      const node = input.current;
      if (!node) return;
      // The prototype setter bypasses React's value tracker, so the input event reads as a change.
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set?.call(node, '');
      node.dispatchEvent(new Event('input', { bubbles: true }));
      node.focus();
    },
  };
}
