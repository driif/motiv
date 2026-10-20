import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { SegmentedControl } from './SegmentedControl';

const options = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
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
      />,
    );
    expect(screen.getByRole('radiogroup', { name: 'Range' })).toHaveClass('motiv-segmented', 'x');
    const week = screen.getByRole('radio', { name: 'Week' });
    expect(week).toHaveAttribute('aria-checked', 'true');
    expect(week).toHaveAttribute('tabindex', '0');
    expect(screen.getByRole('radio', { name: 'Day' })).toHaveAttribute('tabindex', '-1');
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
    day.focus();
    fireEvent.keyDown(day, { key: 'ArrowUp' });
    const month = screen.getByRole('radio', { name: 'Month' });
    expect(month).toHaveFocus();
    expect(month).toHaveAttribute('aria-checked', 'true');
    fireEvent.keyDown(month, { key: 'ArrowDown' });
    expect(day).toHaveFocus();
    fireEvent.keyDown(day, { key: 'ArrowRight' });
    expect(screen.getByRole('radio', { name: 'Week' })).toHaveFocus();
    fireEvent.keyDown(document.activeElement as Element, { key: 'ArrowLeft' });
    expect(day).toHaveAttribute('aria-checked', 'true');
  });

  it('keeps arrow keys working when the caller passes onKeyDown', () => {
    const onKeyDown = vi.fn();
    const onChange = vi.fn();
    render(
      <SegmentedControl
        label="Range"
        options={options}
        value="day"
        onChange={onChange}
        onKeyDown={onKeyDown}
      />,
    );
    fireEvent.keyDown(screen.getByRole('radio', { name: 'Day' }), { key: 'ArrowRight' });
    expect(onKeyDown).toHaveBeenCalled();
    expect(onChange).toHaveBeenCalledWith('week');
  });
});
