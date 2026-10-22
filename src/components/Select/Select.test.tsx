import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Select } from './Select';

const options = [
  { value: 'apple', label: 'Apple', code: 'AP', hint: 'Crisp' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: <em>Cherry</em> },
];

function Controlled() {
  const [value, setValue] = useState('');
  return (
    <>
      <Select label="Fruit" options={options} value={value} onChange={setValue} name="fruit" />
      <button type="button">Outside</button>
    </>
  );
}

const combobox = () => screen.getByRole('combobox', { name: 'Fruit' });
const key = (k: string) => fireEvent.keyDown(combobox(), { key: k });
const activeOption = () =>
  document.getElementById(combobox().getAttribute('aria-activedescendant') ?? '');

describe('Select', () => {
  it('is a closed combobox showing the placeholder, with an inert listbox', () => {
    render(<Controlled />);
    expect(combobox()).toHaveAttribute('aria-expanded', 'false');
    expect(combobox()).toHaveTextContent('Select…');
    const list = document.getElementById(combobox().getAttribute('aria-controls') ?? '');
    expect(list).toHaveAttribute('role', 'listbox');
    expect(list).toHaveAttribute('inert');
  });

  it('opens on click, selects a clicked option and closes outside', () => {
    render(<Controlled />);
    fireEvent.click(combobox());
    expect(combobox()).toHaveAttribute('aria-expanded', 'true');
    fireEvent.click(screen.getByRole('option', { name: /Apple/ }));
    expect(combobox()).toHaveTextContent('APApple');
    expect(combobox()).toHaveAccessibleDescription('Crisp');
    expect(document.querySelector('input[name="fruit"]')).toHaveValue('apple');
    fireEvent.click(combobox());
    fireEvent.pointerDown(screen.getByRole('button', { name: 'Outside' }));
    expect(combobox()).toHaveAttribute('aria-expanded', 'false');
  });

  it('moves, types ahead and commits from the keyboard', () => {
    render(<Controlled />);
    key('ArrowDown');
    expect(activeOption()).toHaveTextContent('Apple');
    key('End');
    expect(activeOption()).toHaveTextContent('Cherry');
    key('Escape');
    expect(combobox()).toHaveTextContent('Select…');
    key('b');
    expect(activeOption()).toHaveTextContent('Banana');
    key('Enter');
    expect(combobox()).toHaveTextContent('Banana');
    expect(screen.getByRole('option', { name: 'Banana', hidden: true })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });

  it('is disabled and passes className and native props to the root', () => {
    const { container } = render(
      <Select
        label="Fruit"
        options={options}
        value=""
        onChange={vi.fn()}
        placeholder="Pick one"
        className="x"
        id="s"
        disabled
      />,
    );
    expect(combobox()).toBeDisabled();
    expect(combobox()).toHaveTextContent('Pick one');
    expect(container.firstChild).toHaveClass('motiv-picker', 'x');
    expect(container.firstChild).toHaveAttribute('id', 's');
  });
});
