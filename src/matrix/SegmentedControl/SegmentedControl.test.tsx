import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { SegmentedControl } from './SegmentedControl';

const options = [
  { value: 'day', label: 'Day', hint: 'Last 24 hours' },
  { value: 'week', label: 'Week', hint: 'Last 7 days' },
  { value: 'month', label: 'Month', hint: 'Last 30 days' },
];

function Controlled() {
  const [value, setValue] = useState('day');
  return <SegmentedControl label="Range" options={options} value={value} onChange={setValue} />;
}

describe('SegmentedControl', () => {
  it('is a radiogroup with one checked, tabbable radio and its hint', () => {
    render(
      <SegmentedControl
        label="Range"
        options={options}
        value="week"
        onChange={vi.fn()}
        className="x"
        data-testid="seg"
      />,
    );
    const group = screen.getByRole('radiogroup', { name: 'Range' });
    expect(group).toHaveClass('motiv-matrix-segmented', 'x');
    expect(group).toHaveAttribute('data-testid', 'seg');
    const week = screen.getByRole('radio', { name: 'Week' });
    expect(week).toHaveAttribute('aria-checked', 'true');
    expect(week).toHaveAttribute('tabindex', '0');
    expect(screen.getByRole('radio', { name: 'Day' })).toHaveAttribute('tabindex', '-1');
    expect(screen.getByText('Last 7 days')).toHaveAttribute('data-active', 'true');
    expect(screen.getByText('Last 24 hours')).toHaveAttribute('aria-hidden', 'true');
  });

  it('renders no hint row without hints', () => {
    const { container } = render(
      <SegmentedControl
        label="Range"
        options={options.map(({ hint: _, ...option }) => option)}
        value="day"
        onChange={vi.fn()}
      />,
    );
    expect(container.querySelector('.motiv-matrix-segmented__hints')).toBeNull();
  });

  it('reports clicks', () => {
    const onChange = vi.fn();
    render(<SegmentedControl label="Range" options={options} value="day" onChange={onChange} />);
    fireEvent.click(screen.getByRole('radio', { name: 'Month' }));
    expect(onChange).toHaveBeenCalledWith('month');
  });

  it('moves selection and focus with wrapping arrows', () => {
    render(<Controlled />);
    const day = screen.getByRole('radio', { name: 'Day' });
    fireEvent.keyDown(day, { key: 'ArrowUp' });
    const month = screen.getByRole('radio', { name: 'Month' });
    expect(month).toHaveFocus();
    expect(month).toHaveAttribute('aria-checked', 'true');
    fireEvent.keyDown(month, { key: 'ArrowDown' });
    expect(day).toHaveFocus();
    expect(day).toHaveAttribute('aria-checked', 'true');
  });

  it('runs the caller onKeyDown first and respects preventDefault', () => {
    const onChange = vi.fn();
    const { rerender } = render(
      <SegmentedControl
        label="Range"
        options={options}
        value="day"
        onChange={onChange}
        onKeyDown={vi.fn()}
      />,
    );
    const day = screen.getByRole('radio', { name: 'Day' });
    fireEvent.keyDown(day, { key: 'ArrowRight' });
    expect(onChange).toHaveBeenCalledWith('week');
    onChange.mockClear();
    rerender(
      <SegmentedControl
        label="Range"
        options={options}
        value="day"
        onChange={onChange}
        onKeyDown={(event) => event.preventDefault()}
      />,
    );
    fireEvent.keyDown(day, { key: 'ArrowRight' });
    expect(onChange).not.toHaveBeenCalled();
  });

  it('keeps the first option tabbable when nothing matches', () => {
    const onChange = vi.fn();
    render(<SegmentedControl label="Range" options={options} value="" onChange={onChange} />);
    const day = screen.getByRole('radio', { name: 'Day' });
    expect(day).toHaveAttribute('tabindex', '0');
    fireEvent.keyDown(day, { key: 'ArrowRight' });
    expect(onChange).toHaveBeenCalledWith('day');
  });
});
