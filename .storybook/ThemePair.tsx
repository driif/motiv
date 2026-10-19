import type { ReactNode } from 'react';

export function ThemePair({ children }: { children: (theme: 'light' | 'dark') => ReactNode }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
      {(['light', 'dark'] as const).map((theme) => (
        <div
          key={theme}
          data-theme={theme}
          style={{
            display: 'grid',
            gap: '1rem',
            minWidth: '16rem',
            padding: '2rem',
            color: 'var(--motiv-color-text)',
            background: 'var(--motiv-color-bg)',
          }}
        >
          {children(theme)}
        </div>
      ))}
    </div>
  );
}
