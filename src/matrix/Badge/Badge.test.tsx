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
    expect(badge).toHaveClass('motiv-matrix-badge', 'motiv-matrix-badge--neutral');
    expect(badge).not.toHaveClass('motiv-matrix-badge--md');
  });

  it.each(['neutral', 'success', 'warning', 'danger'] as const)('applies the %s tone', (tone) => {
    render(<Badge tone={tone}>Status</Badge>);
    expect(screen.getByText('Status')).toHaveClass(`motiv-matrix-badge--${tone}`);
  });

  it('adds the md modifier for size md', () => {
    render(<Badge size="md">Big</Badge>);
    expect(screen.getByText('Big')).toHaveClass('motiv-matrix-badge--md');
  });

  it('merges className and passes native props, style and ref through', () => {
    const ref = createRef<HTMLSpanElement>();
    render(
      <Badge ref={ref} className="extra" title="Published" data-id="7" style={{ marginLeft: 4 }}>
        Live
      </Badge>,
    );
    const badge = screen.getByText('Live');
    expect(badge).toHaveClass('motiv-matrix-badge', 'extra');
    expect(badge).toHaveAttribute('title', 'Published');
    expect(badge).toHaveAttribute('data-id', '7');
    expect(badge).toHaveStyle({ marginLeft: '4px' });
    expect(ref.current).toBe(badge);
  });

  it('centres its text when stretched', () => {
    expect(css).toMatch(/\.motiv-matrix-badge \{[^}]*justify-content: center;/);
  });

  it('takes the trailing letter-spacing off the end padding in every size', () => {
    const spacing = css.match(/letter-spacing:\s*([^;]+);/)?.[1];
    const rules = [
      ...css.matchAll(/padding: [^;]+ (calc\([^;]+\));\s*padding-inline-end: ([^;]+);/g),
    ];
    expect(rules).toHaveLength(2);
    for (const [, side, end] of rules) {
      expect(end).toBe(`${side.slice(0, -1)} - ${spacing})`);
    }
  });
});
