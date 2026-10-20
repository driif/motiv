import type { ReactNode } from 'react';

// Internal: the kinetic line-icon frame (24px grid, 1.65 stroke). Not exported from the entry.
export function Icon({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.65}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}
