import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Chips } from './Chips';

const options = [
  { value: 'open', label: 'Open' },
  { value: 'review', label: 'In review' },
  { value: 'done', label: 'Done' },
];

describe('Chips', () => {
  it('is a group of pressed-state chips that add and remove values', () => {
    const onChange = vi.fn();
    render(
      <Chips
        label="Status"
        options={options}
        value={['open']}
        onChange={onChange}
        className="x"
        data-testid="c"
      />,
    );
    expect(screen.getByTestId('c')).toHaveClass('motiv-sketch-chips', 'x');
    expect(screen.getByRole('group', { name: 'Status' })).toBeInTheDocument();
    const open = screen.getByRole('button', { name: 'Open' });
    expect(open).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(screen.getByRole('button', { name: 'Done' }));
    expect(onChange).toHaveBeenLastCalledWith(['open', 'done']);
    fireEvent.click(open);
    expect(onChange).toHaveBeenLastCalledWith([]);
  });

  it('summarises the selection and clears it', () => {
    const onChange = vi.fn();
    const { rerender } = render(
      <Chips label="Status" options={options} value={[]} onChange={onChange} />,
    );
    expect(screen.getByText('None selected')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Clear' })).toBeDisabled();
    rerender(
      <Chips label="Status" options={options} value={['open', 'done']} onChange={onChange} />,
    );
    expect(screen.getByText('2 of 3 selected')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Clear' }));
    expect(onChange).toHaveBeenCalledWith([]);
  });

  it('takes custom summary text or hides it', () => {
    const { rerender } = render(
      <Chips
        label="Status"
        options={options}
        value={['open']}
        onChange={vi.fn()}
        summary={(n) => `${n} filters`}
        clearLabel="Reset"
      />,
    );
    expect(screen.getByText('1 filters')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reset' })).toBeEnabled();
    rerender(
      <Chips
        label="Status"
        options={options}
        value={['open']}
        onChange={vi.fn()}
        showSummary={false}
      />,
    );
    expect(screen.queryByText('1 of 3 selected')).toBeNull();
  });
});
