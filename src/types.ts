import type { ReactNode } from 'react';

export interface MotivOption {
  value: string;
  label: ReactNode;
  hint?: ReactNode;
}
