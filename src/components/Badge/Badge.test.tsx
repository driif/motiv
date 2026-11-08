import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { Badge } from './Badge';

describe('Badge', () => {
  it('renders its children as a neutral sm badge by default', () => {
    render(<Badge>Draft</Badge>);
    const badge = screen.getByText('Draft');
    expect(badge.tagName).toBe('SPAN');
    expect(badge).toHaveClass('motiv-status-badge', 'motiv-status-badge--neutral');
    expect(badge).not.toHaveClass('motiv-status-badge--md');
  });

  it.each(['neutral', 'success', 'warning', 'danger'] as const)('applies the %s tone', (tone) => {
    render(<Badge tone={tone}>Status</Badge>);
    expect(screen.getByText('Status')).toHaveClass(`motiv-status-badge--${tone}`);
  });

  it('adds the md modifier for size md', () => {
    render(<Badge size="md">Big</Badge>);
    expect(screen.getByText('Big')).toHaveClass('motiv-status-badge--md');
  });

  it('merges className and passes native props, style and ref through', () => {
    const ref = createRef<HTMLSpanElement>();
    render(
      <Badge ref={ref} className="extra" title="Published" data-id="7" style={{ marginLeft: 4 }}>
        Live
      </Badge>,
    );
    const badge = screen.getByText('Live');
    expect(badge).toHaveClass('motiv-status-badge', 'extra');
    expect(badge).toHaveAttribute('title', 'Published');
    expect(badge).toHaveAttribute('data-id', '7');
    expect(badge).toHaveStyle({ marginLeft: '4px' });
    expect(ref.current).toBe(badge);
  });
});
