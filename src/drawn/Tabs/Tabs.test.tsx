import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Tabs } from './Tabs';

const items = [
  { value: 'tea', label: 'Tea', panel: 'Hot leaves' },
  { value: 'coffee', label: 'Coffee', panel: 'Roasted beans' },
  { value: 'water', label: 'Water', panel: 'Plain' },
];

function Controlled() {
  const [value, setValue] = useState('tea');
  return <Tabs label="Drinks" items={items} value={value} onChange={setValue} />;
}

describe('Tabs', () => {
  it('links tabs and panels and shows only the selected panel', () => {
    render(<Tabs label="Drinks" items={items} value="coffee" onChange={vi.fn()} className="x" />);
    expect(screen.getByRole('tablist', { name: 'Drinks' })).toBeInTheDocument();
    const tab = screen.getByRole('tab', { name: 'Coffee' });
    expect(tab).toHaveAttribute('aria-selected', 'true');
    expect(tab).toHaveAttribute('tabindex', '0');
    expect(screen.getByRole('tab', { name: 'Tea' })).toHaveAttribute('tabindex', '-1');
    const panel = screen.getByRole('tabpanel', { name: 'Coffee' });
    expect(panel).toHaveTextContent('Roasted beans');
    expect(tab).toHaveAttribute('aria-controls', panel.id);
    expect(screen.getAllByRole('tabpanel')).toHaveLength(1);
    expect(panel.parentElement).toHaveClass('motiv-tabs', 'x');
  });

  it('reports clicks', () => {
    const onChange = vi.fn();
    render(<Tabs label="Drinks" items={items} value="tea" onChange={onChange} />);
    fireEvent.click(screen.getByRole('tab', { name: 'Water' }));
    expect(onChange).toHaveBeenCalledWith('water');
  });

  it('moves selection and focus with wrapping arrows, Home and End', () => {
    render(<Controlled />);
    const tea = screen.getByRole('tab', { name: 'Tea' });
    tea.focus();
    fireEvent.keyDown(tea, { key: 'ArrowLeft' });
    expect(screen.getByRole('tab', { name: 'Water' })).toHaveFocus();
    expect(screen.getByRole('tab', { name: 'Water' })).toHaveAttribute('aria-selected', 'true');
    fireEvent.keyDown(document.activeElement as Element, { key: 'ArrowRight' });
    expect(tea).toHaveFocus();
    fireEvent.keyDown(tea, { key: 'End' });
    expect(screen.getByRole('tab', { name: 'Water' })).toHaveFocus();
    fireEvent.keyDown(document.activeElement as Element, { key: 'Home' });
    expect(tea).toHaveFocus();
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Hot leaves');
  });
});
