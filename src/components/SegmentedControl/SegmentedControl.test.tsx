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
  it('is a radiogroup with one checked, tabbable radio', () => {
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
    expect(group).toHaveClass('motiv-segmented', 'x');
    expect(group).toHaveAttribute('data-testid', 'seg');
    const week = screen.getByRole('radio', { name: 'Week' });
    expect(week).toHaveAttribute('aria-checked', 'true');
    expect(week).toHaveAttribute('tabindex', '0');
    expect(screen.getByRole('radio', { name: 'Day' })).toHaveAttribute('tabindex', '-1');
    expect(screen.getByText('Last 7 days')).toHaveAttribute('data-active', 'true');
  });

  it('reports clicks', () => {
    const onChange = vi.fn();
    render(<SegmentedControl label="Range" options={options} value="day" onChange={onChange} />);
    fireEvent.click(screen.getByRole('radio', { name: 'Month' }));
    expect(onChange).toHaveBeenCalledWith('month');
  });

  it('moves selection and focus with arrow keys, wrapping', () => {
    render(<Controlled />);
    const day = screen.getByRole('radio', { name: 'Day' });
    fireEvent.keyDown(day, { key: 'ArrowLeft' });
    const month = screen.getByRole('radio', { name: 'Month' });
    expect(month).toHaveAttribute('aria-checked', 'true');
    expect(month).toHaveFocus();
    fireEvent.keyDown(month, { key: 'ArrowRight' });
    expect(day).toHaveAttribute('aria-checked', 'true');
  });
});
