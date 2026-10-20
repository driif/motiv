import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { DrillStack } from './DrillStack';

const path = [
  { id: 'root', name: 'acme' },
  { id: 'eu', name: 'eu-west', meta: '3 clusters' },
  { id: 'prod', name: 'prod', meta: '12 services' },
];

describe('DrillStack', () => {
  it('renders breadcrumbs for the ancestors and the current level as the page', () => {
    const onNavigate = vi.fn();
    render(<DrillStack path={path} onNavigate={onNavigate} className="x" />);
    const nav = screen.getByRole('navigation', { name: 'Path' });
    expect(nav.parentElement).toHaveClass('motiv-drill', 'x');
    expect(screen.getByText('prod', { selector: '[aria-current="page"]' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'eu-west' }));
    expect(onNavigate).toHaveBeenCalledWith(1);
    expect(screen.queryByRole('button', { name: 'Open next level' })).toBeNull();
  });

  it('shows the drill arrow when onDrill is given and respects canDrill', () => {
    const onDrill = vi.fn();
    const { rerender } = render(
      <DrillStack path={path} onNavigate={vi.fn()} onDrill={onDrill} drillLabel="Deeper" />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Deeper' }));
    expect(onDrill).toHaveBeenCalledTimes(1);
    rerender(<DrillStack path={path} onNavigate={vi.fn()} onDrill={onDrill} canDrill={false} />);
    expect(screen.getByRole('button', { name: 'Open next level' })).toBeDisabled();
  });
});
