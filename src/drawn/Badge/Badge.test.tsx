/// <reference types="vite/client" />
import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { Badge } from './Badge';
import css from './Badge.css?raw';

describe('Badge', () => {
  it('renders its children as a neutral sm badge by default', () => {
    render(<Badge>Draft</Badge>);
    const badge = screen.getByText('Draft');
    expect(badge.tagName).toBe('SPAN');
    expect(badge).toHaveClass('motiv-sketch-badge', 'motiv-sketch-badge--neutral');
    expect(badge).not.toHaveClass('motiv-sketch-badge--md');
  });

  it.each(['neutral', 'success', 'warning', 'danger'] as const)('applies the %s tone', (tone) => {
    render(<Badge tone={tone}>Status</Badge>);
    expect(screen.getByText('Status')).toHaveClass(`motiv-sketch-badge--${tone}`);
  });

  it('adds the md modifier for size md', () => {
    render(<Badge size="md">Big</Badge>);
    expect(screen.getByText('Big')).toHaveClass('motiv-sketch-badge--md');
  });

  it('merges className and passes native props, style and ref through', () => {
    const ref = createRef<HTMLSpanElement>();
    render(
      <Badge ref={ref} className="extra" title="Published" data-id="7" style={{ marginLeft: 4 }}>
        Live
      </Badge>,
    );
    const badge = screen.getByText('Live');
    expect(badge).toHaveClass('motiv-sketch-badge', 'extra');
    expect(badge).toHaveAttribute('title', 'Published');
    expect(badge).toHaveAttribute('data-id', '7');
    expect(badge).toHaveStyle({ marginLeft: '4px' });
    expect(ref.current).toBe(badge);
  });

  it('centres its text when stretched, with no trailing letter-spacing to offset', () => {
    expect(css).toMatch(/\.motiv-sketch-badge \{[^}]*justify-content: center;/);
    expect(css).not.toMatch(/letter-spacing/);
  });
});
