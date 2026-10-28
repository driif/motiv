import { useMemo } from 'react';
import type { MotivOption } from '../types';

type Option = MotivOption & { code?: string };

export function useSelectOptions(
  options: Option[],
  clearable: boolean | undefined,
  clearLabel: string,
) {
  return useMemo(
    () =>
      clearable && !options.some((option) => option.value === '')
        ? [{ value: '', label: clearLabel }, ...options]
        : options,
    [options, clearable, clearLabel],
  );
}
