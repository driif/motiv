import { fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Radio, RadioGroup } from './Radio';

const options = [
  { value: 'tea', label: 'Tea' },
  { value: 'coffee', label: 'Coffee' },
];

describe('Radio', () => {
  it('is a native radio named by its label, with className on the label and ref on the input', () => {
    const ref = createRef<HTMLInputElement>();
    const { container } = render(<Radio ref={ref} label="Tea" name="drink" className="extra" />);
    const radio = screen.getByRole('radio', { name: 'Tea' });
    expect(container.firstChild).toHaveClass('motiv-matrix-radio', 'extra');
    expect(ref.current).toBe(radio);
    fireEvent.click(screen.getByText('Tea'));
    expect(radio).toBeChecked();
  });
});

describe('RadioGroup', () => {
  it('is a group named by its legend with one shared name', () => {
    render(
      <RadioGroup name="drink" legend="Drink" options={options} value="tea" onChange={vi.fn()} />,
    );
    expect(screen.getByRole('group', { name: 'Drink' })).toHaveClass('motiv-matrix-radio-group');
    const radios = screen.getAllByRole('radio');
    expect(radios).toHaveLength(2);
    for (const radio of radios) expect(radio).toHaveAttribute('name', 'drink');
  });

  it('checks the radio matching value and reports changes', () => {
    const onChange = vi.fn();
    render(
      <RadioGroup name="drink" legend="Drink" options={options} value="tea" onChange={onChange} />,
    );
    expect(screen.getByRole('radio', { name: 'Tea' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Coffee' })).not.toBeChecked();
    fireEvent.click(screen.getByRole('radio', { name: 'Coffee' }));
    expect(onChange).toHaveBeenCalledWith('coffee');
  });

  it('passes fieldset props through', () => {
    render(
      <RadioGroup
        name="drink"
        legend="Drink"
        options={options}
        value="tea"
        onChange={vi.fn()}
        disabled
        className="extra"
      />,
    );
    expect(screen.getByRole('group')).toHaveClass('extra');
    for (const radio of screen.getAllByRole('radio')) expect(radio).toBeDisabled();
  });
});
