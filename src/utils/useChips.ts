import type { ReactNode } from 'react';
import type { MotivOption } from '../types';

const defaultSummary = (count: number, total: number) =>
  count ? `${count} of ${total} selected` : 'None selected';

/** Multi-select chip state: toggle a value, clear all; `summarize` runs only where the summary renders. */
export function useChips({
  options,
  value,
  onChange,
  summary = defaultSummary,
}: {
  options: MotivOption[];
  value: string[];
  onChange: (value: string[]) => void;
  summary?: (count: number, total: number) => ReactNode;
}) {
  const count = options.filter((option) => value.includes(option.value)).length;

  function toggle(v: string) {
    onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v]);
  }

  return {
    count,
    toggle,
    clear: () => onChange([]),
    summarize: () => summary(count, options.length),
  };
}
