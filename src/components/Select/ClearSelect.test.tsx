import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { Select as DrawnSelect } from '../../drawn/Select';
import { Select as MatrixSelect } from '../../matrix/Select';
import { TerminalSelect } from '../../matrix/TerminalSelect';
import { Select } from './Select';

const options = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
];

beforeAll(() => {
  const style = document.createElement('style');
  style.textContent = '[popover]:not([hidden]) { display: block !important; }';
  document.head.append(style);
});

describe.each([
  ['kinetic', Select],
  ['drawn', DrawnSelect],
  ['matrix', MatrixSelect],
  ['terminal', TerminalSelect],
] as const)('%s Select clear action', (_, Component) => {
  it('clears the selected value and keeps its form value in sync', () => {
    const onChange = vi.fn();
    function Controlled() {
      const [value, setValue] = useState('apple');
      return (
        <Component
          label="Fruit"
          options={options}
          value={value}
          onChange={(next) => {
            onChange(next);
            setValue(next);
          }}
          placeholder="Choose a fruit"
          name="fruit"
          clearable
        />
      );
    }
    render(<Controlled />);
    const trigger = screen.getByRole('combobox', { name: 'Fruit' });
    trigger.focus();
    fireEvent.click(trigger);
    fireEvent.click(screen.getByRole('option', { name: 'Clear selection' }));
    expect(onChange).toHaveBeenCalledWith('');
    expect(trigger).toHaveTextContent('Choose a fruit');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(document.querySelector('input[name="fruit"]')).toHaveValue('');
  });

  it('clears by keyboard using a localized label', () => {
    const onChange = vi.fn();
    render(
      <Component
        label="Fruit"
        options={options}
        value="apple"
        onChange={onChange}
        clearable
        clearLabel="Auswahl löschen"
      />,
    );
    const trigger = screen.getByRole('combobox', { name: 'Fruit' });
    trigger.focus();
    fireEvent.keyDown(trigger, { key: 'Enter' });
    fireEvent.keyDown(trigger, { key: 'Home' });
    expect(
      document.getElementById(trigger.getAttribute('aria-activedescendant') ?? ''),
    ).toHaveTextContent('Auswahl löschen');
    fireEvent.keyDown(trigger, { key: 'Enter' });
    expect(onChange).toHaveBeenCalledWith('');
    expect(trigger).toHaveFocus();
  });

  it('does not add a clear option by default or duplicate an existing empty option', () => {
    const onChange = vi.fn();
    const { rerender } = render(
      <Component label="Fruit" options={options} value="apple" onChange={onChange} />,
    );
    fireEvent.click(screen.getByRole('combobox', { name: 'Fruit' }));
    expect(screen.queryByRole('option', { name: 'Clear selection' })).not.toBeInTheDocument();
    rerender(
      <Component
        label="Fruit"
        options={[{ value: '', label: 'None' }, ...options]}
        value="apple"
        onChange={onChange}
        clearable
      />,
    );
    expect(screen.getAllByRole('option')).toHaveLength(3);
    fireEvent.click(screen.getByRole('option', { name: 'None' }));
    expect(onChange).toHaveBeenCalledWith('');
  });
});
