import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Tabs } from './Tabs';

const items = [
  { value: 'a', label: 'Alpha', panel: 'Panel A' },
  { value: 'b', label: 'Beta', panel: 'Panel B' },
];

describe('Tabs', () => {
  it('selects the current tab and ties it to its panel', () => {
    render(<Tabs label="Sections" items={items} value="b" onChange={vi.fn()} />);
    expect(screen.getByRole('tablist', { name: 'Sections' })).toBeInTheDocument();
    const tab = screen.getByRole('tab', { name: 'Beta' });
    expect(tab).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: 'Alpha' })).toHaveAttribute('aria-selected', 'false');
    const panel = document.getElementById(tab.getAttribute('aria-controls') ?? '');
    expect(panel).toHaveTextContent('Panel B');
    expect(panel).toHaveAttribute('aria-labelledby', tab.id);
  });

  it('reports clicks and arrow keys through onChange', () => {
    const onChange = vi.fn();
    render(<Tabs label="Sections" items={items} value="a" onChange={onChange} />);
    fireEvent.click(screen.getByRole('tab', { name: 'Beta' }));
    expect(onChange).toHaveBeenLastCalledWith('b');
    fireEvent.keyDown(screen.getByRole('tab', { name: 'Alpha' }), { key: 'ArrowLeft' });
    expect(onChange).toHaveBeenLastCalledWith('b');
  });

  it('passes className and native props to the root', () => {
    const { container } = render(
      <Tabs label="Sections" items={items} value="a" onChange={vi.fn()} className="x" id="t" />,
    );
    expect(container.firstChild).toHaveClass('motiv-elastic-tabs', 'x');
    expect(container.firstChild).toHaveAttribute('id', 't');
  });
});
