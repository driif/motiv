import { act, fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { Select } from './Select';

const options = [
  { value: 'apple', label: 'Apple', code: 'AP', hint: 'Crisp' },
  { value: 'banana', label: 'Banana' },
  { value: 'blueberry', label: 'Blueberry' },
  { value: 'cherry', label: 'Cherry' },
];

function Controlled({ initial = '' }: { initial?: string }) {
  const [value, setValue] = useState(initial);
  return (
    <>
      <Select label="Fruit" options={options} value={value} onChange={setValue} name="fruit" />
      <button type="button">Outside</button>
    </>
  );
}

const combobox = () => screen.getByRole('combobox', { name: 'Fruit' });
const key = (k: string, init?: object) => fireEvent.keyDown(combobox(), { key: k, ...init });
const activeOption = () =>
  document.getElementById(combobox().getAttribute('aria-activedescendant') ?? '');

afterEach(() => vi.useRealTimers());

// jsdom has UA popover hiding but no popover API; mirror the open-list CSS.
const style = document.createElement('style');
beforeAll(() => {
  style.textContent = '[popover]:not([hidden]) { display: block !important; }';
  document.head.append(style);
});
afterAll(() => style.remove());

describe('Select', () => {
  it('is a closed combobox showing the placeholder, with an inert listbox', () => {
    render(<Controlled />);
    expect(combobox()).toHaveAttribute('aria-expanded', 'false');
    expect(combobox()).toHaveTextContent('Select…');
    expect(combobox()).not.toHaveAttribute('aria-activedescendant');
    const list = document.getElementById(combobox().getAttribute('aria-controls') ?? '');
    expect(list).toHaveAttribute('role', 'listbox');
    expect(list).toHaveAttribute('inert');
  });

  it('opens in the top layer, flips above near the viewport bottom and follows scroll', () => {
    const { container } = render(<Controlled />);
    const list = container.querySelector('[role="listbox"]') as HTMLUListElement;
    list.showPopover = vi.fn();
    list.hidePopover = vi.fn();
    expect(list).toHaveAttribute('popover', 'manual');
    expect(list).toHaveAttribute('hidden');
    const rect = vi.spyOn(combobox().parentElement as HTMLDivElement, 'getBoundingClientRect');
    rect.mockReturnValue({
      top: window.innerHeight - 60,
      bottom: window.innerHeight - 12,
      left: 24,
      width: 240,
    } as DOMRect);
    Object.defineProperty(list, 'offsetHeight', { value: 200 });
    fireEvent.click(combobox());
    expect(list.showPopover).toHaveBeenCalledOnce();
    expect(list).not.toHaveAttribute('hidden');
    expect(list.style.top).toBe(`${window.innerHeight - 268}px`);
    expect(list.style.left).toBe('24px');
    expect(list.style.width).toBe('240px');
    expect(list.style.getPropertyValue('--_flip')).toBe('1');
    rect.mockReturnValue({ top: 20, bottom: 68, left: 30, width: 300 } as DOMRect);
    fireEvent.scroll(container);
    expect(list.style.top).toBe('76px');
    expect(list.style.getPropertyValue('--_flip')).toBe('0');
    key('Escape');
    expect(list.hidePopover).toHaveBeenCalledOnce();
    expect(list).toHaveAttribute('hidden');
  });

  it('opens on click and selects a clicked option', () => {
    const onChange = vi.fn();
    render(<Select label="Fruit" options={options} value="" onChange={onChange} />);
    fireEvent.click(combobox());
    expect(combobox()).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('listbox')).not.toHaveAttribute('inert');
    fireEvent.click(screen.getByRole('option', { name: 'Cherry' }));
    expect(onChange).toHaveBeenCalledWith('cherry');
    expect(combobox()).toHaveAttribute('aria-expanded', 'false');
  });

  it('opens on the selected option and moves without wrapping', () => {
    render(<Controlled initial="banana" />);
    key('Enter');
    expect(combobox()).toHaveAttribute('aria-expanded', 'true');
    expect(activeOption()).toHaveTextContent('Banana');
    expect(screen.getByRole('option', { name: 'Banana' })).toHaveAttribute('aria-selected', 'true');
    key('End');
    key('ArrowDown');
    expect(activeOption()).toHaveTextContent('Cherry');
    key('Home');
    key('ArrowUp');
    expect(activeOption()).toHaveTextContent('Apple');
    key('PageDown');
    expect(activeOption()).toHaveTextContent('Cherry');
    key('PageUp');
    expect(activeOption()).toHaveTextContent('Apple');
  });

  it('commits with Enter, Space and Tab; Escape keeps the value', () => {
    render(<Controlled />);
    key('ArrowDown');
    key('ArrowDown');
    key('Enter');
    expect(combobox()).toHaveTextContent('Banana');
    expect(combobox()).toHaveAttribute('aria-expanded', 'false');
    key(' ');
    key('ArrowDown');
    key(' ');
    expect(combobox()).toHaveTextContent('Blueberry');
    key('ArrowDown');
    key('ArrowDown');
    key('Escape');
    expect(combobox()).toHaveAttribute('aria-expanded', 'false');
    expect(combobox()).toHaveTextContent('Blueberry');
    key('ArrowUp');
    key('ArrowDown');
    key('Tab');
    expect(combobox()).toHaveTextContent('Cherry');
    expect(document.querySelector('input[type="hidden"]')).toHaveValue('cherry');
  });

  it('shows the code and hint of the selected option', () => {
    render(<Controlled initial="apple" />);
    expect(combobox()).toHaveTextContent('APApple');
    expect(combobox()).toHaveAccessibleDescription('Crisp');
  });

  it('types ahead on option text and resets the buffer after 500ms', () => {
    vi.useFakeTimers();
    render(<Controlled />);
    key('b');
    expect(combobox()).toHaveAttribute('aria-expanded', 'true');
    expect(activeOption()).toHaveTextContent('Banana');
    key('l');
    expect(activeOption()).toHaveTextContent('Blueberry');
    act(() => vi.advanceTimersByTime(500));
    key('b');
    expect(activeOption()).toHaveTextContent('Banana');
    key('b');
    expect(activeOption()).toHaveTextContent('Blueberry');
    key('b');
    expect(activeOption()).toHaveTextContent('Banana');
  });

  it('types ahead from a closed combobox with nothing selected', () => {
    render(<Controlled />);
    key('a');
    expect(activeOption()).toHaveTextContent('Apple');
  });

  it('types ahead on the rendered text of a non-string label', () => {
    const rich = [
      { value: 'a', label: <em>Apple</em> },
      { value: 'p', label: <strong>Pear</strong> },
    ];
    render(<Select label="Fruit" options={rich} value="" onChange={vi.fn()} />);
    key('p');
    expect(activeOption()).toHaveTextContent('Pear');
  });

  it('closes on outside pointerdown only', () => {
    render(<Controlled />);
    fireEvent.click(combobox());
    fireEvent.pointerDown(screen.getByRole('option', { name: /Apple/ }));
    expect(combobox()).toHaveAttribute('aria-expanded', 'true');
    fireEvent.pointerDown(screen.getByRole('button', { name: 'Outside' }));
    expect(combobox()).toHaveAttribute('aria-expanded', 'false');
  });

  it('is disabled, including its form value', () => {
    render(
      <Select label="Fruit" options={options} value="apple" onChange={vi.fn()} name="f" disabled />,
    );
    expect(combobox()).toBeDisabled();
    expect(document.querySelector('input[name="f"]')).toBeDisabled();
  });

  it('stays closed with no options', () => {
    const onChange = vi.fn();
    render(<Select label="Fruit" options={[]} value="" onChange={onChange} />);
    fireEvent.click(combobox());
    fireEvent.keyDown(combobox(), { key: 'Enter' });
    fireEvent.keyDown(combobox(), { key: 'Enter' });
    expect(combobox()).toHaveAttribute('aria-expanded', 'false');
    expect(onChange).not.toHaveBeenCalled();
  });

  it('survives options shrinking while open', () => {
    const onChange = vi.fn();
    const { rerender } = render(
      <Select label="Fruit" options={options} value="cherry" onChange={onChange} />,
    );
    fireEvent.click(combobox());
    rerender(
      <Select label="Fruit" options={options.slice(0, 1)} value="cherry" onChange={onChange} />,
    );
    key('Enter');
    expect(onChange).toHaveBeenCalledWith('apple');
    rerender(<Select label="Fruit" options={[]} value="cherry" onChange={onChange} />);
    expect(combobox()).toHaveAttribute('aria-expanded', 'false');
  });

  it('closes and ignores option clicks when disabled while open', () => {
    const onChange = vi.fn();
    const { rerender } = render(
      <Select label="Fruit" options={options} value="" onChange={onChange} />,
    );
    fireEvent.click(combobox());
    rerender(<Select label="Fruit" options={options} value="" onChange={onChange} disabled />);
    expect(combobox()).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByRole('listbox', { hidden: true })).toHaveAttribute('inert');
    rerender(<Select label="Fruit" options={options} value="" onChange={onChange} />);
    expect(combobox()).toHaveAttribute('aria-expanded', 'false');
  });
});
