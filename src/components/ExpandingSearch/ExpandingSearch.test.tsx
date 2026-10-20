import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { ExpandingSearch } from './ExpandingSearch';

function Controlled(props: { onSubmit?: (v: string) => void; onSelect?: (v: string) => void }) {
  const [q, setQ] = useState('');
  return (
    <ExpandingSearch
      value={q}
      onChange={setQ}
      onSubmit={props.onSubmit}
      onSuggestionSelect={props.onSelect}
      suggestions={['invoices', 'income', 'tax']}
    />
  );
}

describe('ExpandingSearch', () => {
  it('opens from the toggle, focuses the field and closes with Escape', () => {
    render(<Controlled />);
    const toggle = screen.getByRole('button', { name: 'Open search' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByRole('searchbox', { name: 'Search' })).toBeDisabled();
    fireEvent.click(toggle);
    const input = screen.getByRole('searchbox', { name: 'Search' });
    expect(input).toHaveFocus();
    expect(screen.getByRole('button', { name: 'Search' })).toHaveAttribute('aria-expanded', 'true');
    fireEvent.keyDown(input, { key: 'Escape' });
    expect(screen.getByRole('button', { name: 'Open search' })).toHaveFocus();
  });

  it('filters suggestions, moves through them with arrows and submits', () => {
    const onSubmit = vi.fn();
    const onSelect = vi.fn();
    render(<Controlled onSubmit={onSubmit} onSelect={onSelect} />);
    fireEvent.click(screen.getByRole('button', { name: 'Open search' }));
    const input = screen.getByRole('searchbox');
    fireEvent.change(input, { target: { value: 'in' } });
    const list = screen.getByRole('list', { name: 'Suggestions' });
    expect(list.querySelectorAll('button')).toHaveLength(2);
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(screen.getByRole('button', { name: 'invoices' })).toHaveFocus();
    fireEvent.click(screen.getByRole('button', { name: 'income' }));
    expect(onSelect).toHaveBeenCalledWith('income');
    fireEvent.submit(input.closest('form') as HTMLFormElement);
    expect(onSubmit).toHaveBeenCalledWith('income');
  });

  it('passes className and native props to the search landmark', () => {
    render(<ExpandingSearch value="" onChange={vi.fn()} className="x" data-testid="s" />);
    expect(screen.getByRole('search')).toHaveClass('motiv-xsearch', 'x');
  });
});
