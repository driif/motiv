import { act, fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { DatePicker } from './DatePicker';

const field = (label = 'Due date') => screen.getByLabelText(label, { selector: 'input' });
const clearButton = () => screen.queryByRole('button', { name: 'Clear Due date' });

function clear() {
  const button = clearButton();
  if (!button) throw new Error('clear button is not rendered');
  fireEvent.click(button);
}

describe('DatePicker', () => {
  it('renders a native date or datetime-local input inside the field root', () => {
    const { container } = render(
      <>
        <DatePicker label="Due date" className="x" />
        <DatePicker label="Starts" type="datetime-local" />
      </>,
    );
    expect(field()).toHaveAttribute('type', 'date');
    expect(field('Starts')).toHaveAttribute('type', 'datetime-local');
    expect(container.firstChild).toHaveClass('motiv-float', 'motiv-date-picker', 'x');
  });

  it('clears a controlled value with exactly one onChange and hides the button when empty', () => {
    const onChange = vi.fn();
    function Controlled() {
      const [value, setValue] = useState('2026-10-25');
      return (
        <DatePicker
          label="Due date"
          value={value}
          onChange={(event) => {
            onChange(event.currentTarget.value);
            setValue(event.currentTarget.value);
          }}
        />
      );
    }
    render(<Controlled />);
    clear();
    expect(onChange).toHaveBeenCalledExactlyOnceWith('');
    expect(field()).toHaveValue('');
    expect(clearButton()).toBeNull();
  });

  it('keeps a controlled value the app does not change', () => {
    const onChange = vi.fn();
    render(<DatePicker label="Due date" value="2026-10-25" onChange={onChange} />);
    clear();
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(field()).toHaveValue('2026-10-25');
    expect(clearButton()).not.toBeNull();
  });

  it('types and clears an uncontrolled value, then focuses the input', () => {
    const onChange = vi.fn();
    render(
      <DatePicker label="Due date" onChange={(event) => onChange(event.currentTarget.value)} />,
    );
    const input = field();
    expect(clearButton()).toBeNull();
    fireEvent.change(input, { target: { value: '2026-10-25' } });
    clear();
    expect(onChange.mock.calls).toEqual([['2026-10-25'], ['']]);
    expect(input).toHaveValue('');
    expect(input).toHaveFocus();
    expect(clearButton()).toBeNull();
  });

  it('has no clear button when disabled or read-only', () => {
    render(
      <>
        <DatePicker label="Due date" defaultValue="2026-10-25" disabled />
        <DatePicker label="Due date" defaultValue="2026-10-25" readOnly />
      </>,
    );
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('names the clear button after the field with a replaceable label', () => {
    render(<DatePicker label="Deadline" clearLabel="Remove" defaultValue="2026-10-25" />);
    expect(screen.getByRole('button', { name: 'Remove Deadline' })).toHaveAttribute(
      'type',
      'button',
    );
  });

  it('passes native constraints to the input', () => {
    render(
      <DatePicker
        label="Starts"
        type="datetime-local"
        min="2026-10-25T09:00"
        max="2026-12-31T17:00"
        step={900}
        required
      />,
    );
    const input = field('Starts');
    expect(input).toHaveAttribute('min', '2026-10-25T09:00');
    expect(input).toHaveAttribute('max', '2026-12-31T17:00');
    expect(input).toHaveAttribute('step', '900');
    expect(input).toBeRequired();
  });

  it('merges a caller aria-describedby with the hint', () => {
    render(
      <>
        <p id="err">Pick a weekday.</p>
        <DatePicker
          id="due"
          label="Due date"
          hint="DD.MM.YYYY"
          aria-describedby="err"
          aria-invalid
        />
      </>,
    );
    const input = field();
    expect(input).toHaveAttribute('aria-describedby', 'err due-hint');
    expect(input).toHaveAccessibleDescription('Pick a weekday. DD.MM.YYYY');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('submits the native string', () => {
    const { container } = render(
      <form>
        <DatePicker label="Due date" name="due" defaultValue="2026-10-25" />
        <DatePicker
          label="Starts"
          name="starts"
          type="datetime-local"
          defaultValue="2026-10-25T09:30"
        />
      </form>,
    );
    const data = new FormData(container.querySelector('form') as HTMLFormElement);
    expect(data.get('due')).toBe('2026-10-25');
    expect(data.get('starts')).toBe('2026-10-25T09:30');
  });

  it('shows the clear button again when a form reset restores the default', () => {
    const onChange = vi.fn();
    const { container } = render(
      <form>
        <DatePicker
          label="Due date"
          defaultValue="2026-10-25"
          onChange={(event) => onChange(event.currentTarget.value)}
        />
      </form>,
    );
    const input = field();
    clear();
    expect(clearButton()).toBeNull();
    act(() => (container.querySelector('form') as HTMLFormElement).reset());
    expect(input).toHaveValue('2026-10-25');
    expect(clearButton()).not.toBeNull();
    clear();
    expect(onChange.mock.calls).toEqual([[''], ['']]);
    expect(input).toHaveValue('');
  });

  it('hides the clear button when a form reset empties the field', () => {
    const { container } = render(
      <form>
        <DatePicker label="Due date" />
      </form>,
    );
    fireEvent.change(field(), { target: { value: '2026-10-25' } });
    expect(clearButton()).not.toBeNull();
    act(() => (container.querySelector('form') as HTMLFormElement).reset());
    expect(field()).toHaveValue('');
    expect(clearButton()).toBeNull();
  });

  it.each([
    ['date', '2026-10-25'],
    ['datetime-local', '2026-10-25T09:30'],
  ] as const)('reports picking the same %s again after a form reset', (type, picked) => {
    const onChange = vi.fn();
    const { container } = render(
      <form>
        <DatePicker
          label="Due date"
          type={type}
          onChange={(event) => onChange(event.currentTarget.value)}
        />
      </form>,
    );
    fireEvent.change(field(), { target: { value: picked } });
    act(() => (container.querySelector('form') as HTMLFormElement).reset());
    fireEvent.change(field(), { target: { value: picked } });
    expect(onChange.mock.calls).toEqual([[picked], [picked]]);
    expect(clearButton()).not.toBeNull();
  });

  it('preserves React 19 callback-ref cleanup', () => {
    const cleanup = vi.fn();
    const ref = vi.fn(() => cleanup);
    const { unmount } = render(<DatePicker label="Due date" ref={ref} />);
    expect(ref).toHaveBeenCalledExactlyOnceWith(field());
    unmount();
    expect(cleanup).toHaveBeenCalledTimes(1);
  });
});
