import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { Table } from '../Table/Table';
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

beforeAll(() => {
  const style = document.createElement('style');
  style.textContent = '[popover]:not([hidden]) { display: block !important; }';
  document.head.append(style);
});

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

  it('opens in the top layer from a table cell and selects the last option', () => {
    const onChange = vi.fn();
    const { container } = render(
      <Table
        caption="Items"
        columns={[
          {
            id: 'choice',
            label: 'Choice',
            cell: () => <Select label="Fruit" options={options} value="" onChange={onChange} />,
          },
        ]}
        rows={[{ id: 'one' }]}
        getRowKey={(row) => row.id}
      />,
    );
    const list = container.querySelector('[role="listbox"]') as HTMLUListElement;
    list.showPopover = vi.fn();
    list.hidePopover = vi.fn();
    expect(list).toHaveAttribute('popover', 'manual');
    expect(list).toHaveAttribute('hidden');
    fireEvent.click(combobox());
    expect(list.showPopover).toHaveBeenCalledOnce();
    expect(list).not.toHaveAttribute('hidden');
    fireEvent.click(screen.getByRole('option', { name: 'Cherry' }));
    expect(onChange).toHaveBeenCalledWith('cherry');
    expect(list.hidePopover).toHaveBeenCalledOnce();
    expect(list).toHaveAttribute('hidden');
  });

  it('positions the list near the trigger and updates on scroll and resize', () => {
    const { container, unmount } = render(<Controlled />);
    const list = container.querySelector('[role="listbox"]') as HTMLUListElement;
    list.showPopover = vi.fn();
    list.hidePopover = vi.fn();
    const anchor = combobox().parentElement as HTMLDivElement;
    const rect = vi.spyOn(anchor, 'getBoundingClientRect').mockReturnValue({
      top: window.innerHeight - 60,
      bottom: window.innerHeight - 12,
      left: 24,
      width: 240,
    } as DOMRect);
    Object.defineProperty(list, 'offsetHeight', { value: 200 });
    vi.spyOn(list, 'getBoundingClientRect').mockReturnValue({ height: 192 } as DOMRect);
    fireEvent.click(combobox());
    expect(list.style.top).toBe(`${window.innerHeight - 268}px`);
    expect(list.style.left).toBe('24px');
    expect(list.style.width).toBe('240px');
    rect.mockReturnValue({ top: 20, bottom: 68, left: 30, width: 300 } as DOMRect);
    fireEvent.scroll(container);
    expect(list.style.top).toBe('76px');
    expect(list.style.left).toBe('30px');
    expect(list.style.width).toBe('300px');
    fireEvent(window, new Event('resize'));
    expect(rect).toHaveBeenCalledTimes(3);
    fireEvent.scroll(list);
    expect(rect).toHaveBeenCalledTimes(3);
    key('Escape');
    expect(list.hidePopover).toHaveBeenCalledOnce();
    fireEvent.scroll(container);
    expect(rect).toHaveBeenCalledTimes(3);
    unmount();
  });

  it('repositions when the option count changes while open', () => {
    const onChange = vi.fn();
    const { container, rerender } = render(
      <Select label="Fruit" options={options} value="" onChange={onChange} />,
    );
    const list = container.querySelector('[role="listbox"]') as HTMLUListElement;
    list.showPopover = vi.fn();
    list.hidePopover = vi.fn();
    vi.spyOn(combobox().parentElement as HTMLDivElement, 'getBoundingClientRect').mockReturnValue({
      top: window.innerHeight - 60,
      bottom: window.innerHeight - 12,
      left: 24,
      width: 240,
    } as DOMRect);
    let height = 200;
    Object.defineProperty(list, 'offsetHeight', { get: () => height });
    fireEvent.click(combobox());
    expect(list.style.top).toBe(`${window.innerHeight - 268}px`);
    height = 80;
    rerender(<Select label="Fruit" options={options.slice(0, 2)} value="" onChange={onChange} />);
    expect(list.style.top).toBe(`${window.innerHeight - 148}px`);
    expect(list.style.maxHeight).toBe('80px');
    expect(combobox()).toHaveAttribute('aria-expanded', 'true');
  });

  it('repositions when option content changes without closing the list', () => {
    const onChange = vi.fn();
    const { container, rerender } = render(
      <Select label="Fruit" options={options} value="" onChange={onChange} />,
    );
    const list = container.querySelector('[role="listbox"]') as HTMLUListElement;
    list.showPopover = vi.fn();
    list.hidePopover = vi.fn();
    vi.spyOn(combobox().parentElement as HTMLDivElement, 'getBoundingClientRect').mockReturnValue({
      top: window.innerHeight - 60,
      bottom: window.innerHeight - 12,
      left: 24,
      width: 240,
    } as DOMRect);
    let height = 200;
    Object.defineProperty(list, 'offsetHeight', { get: () => height });
    fireEvent.click(combobox());
    expect(list.style.top).toBe(`${window.innerHeight - 268}px`);
    height = 80;
    rerender(
      <Select
        label="Fruit"
        options={options.map((option) => ({ ...option, label: 'Short' }))}
        value=""
        onChange={onChange}
      />,
    );
    expect(list.style.top).toBe(`${window.innerHeight - 148}px`);
    expect(list.hidePopover).not.toHaveBeenCalled();
    expect(list.showPopover).toHaveBeenCalledOnce();
  });

  it('preserves the list scroll position when it is repositioned', () => {
    const { container } = render(<Controlled />);
    const list = container.querySelector('[role="listbox"]') as HTMLUListElement;
    list.showPopover = vi.fn();
    list.hidePopover = vi.fn();
    vi.spyOn(combobox().parentElement as HTMLDivElement, 'getBoundingClientRect').mockReturnValue({
      top: window.innerHeight - 60,
      bottom: window.innerHeight - 12,
      left: 24,
      width: 240,
    } as DOMRect);
    Object.defineProperty(list, 'offsetHeight', {
      get: () => {
        list.scrollTop = 0;
        return 200;
      },
    });
    fireEvent.click(combobox());
    list.scrollTop = 100;
    fireEvent(window, new Event('resize'));
    expect(list.scrollTop).toBe(100);
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
