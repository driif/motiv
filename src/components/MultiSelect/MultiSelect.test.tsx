import { act, fireEvent, render, screen } from '@testing-library/react';
import { createRef, useState } from 'react';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { MultiSelect, type MultiSelectProps } from './MultiSelect';

const options = [
  { value: 'read', label: 'Read', hint: 'View entries' },
  { value: 'write', label: 'Write', hint: 'Edit entries' },
  { value: 'publish', label: 'Publish' },
  { value: 'archive', label: 'Archive' },
  { value: 'delete', label: 'Delete' },
];

function Controlled({ value: initial = [], ...props }: Partial<MultiSelectProps>) {
  const [value, setValue] = useState(initial);
  return (
    <>
      <MultiSelect
        label="Permissions"
        options={options}
        value={value}
        onChange={setValue}
        {...props}
      />
      <button type="button">Outside</button>
    </>
  );
}

const trigger = () => screen.getByRole('button', { name: /^Permissions/ });
const search = () => screen.getByRole('combobox', { name: 'Search' });
const key = (key: string) => fireEvent.keyDown(search(), { key });
const filter = (value: string) => fireEvent.change(search(), { target: { value } });
const active = () => document.getElementById(search().getAttribute('aria-activedescendant') ?? '');

// jsdom has UA popover hiding but no popover API; mirror the component's open-panel CSS.
const style = document.createElement('style');
beforeAll(() => {
  style.textContent = '[popover]:not([hidden]) { display: block !important; }';
  document.head.append(style);
});
afterAll(() => style.remove());

describe('MultiSelect', () => {
  it('renders a labelled, closed trigger and passes native root props and ref through', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Controlled ref={ref} className="custom" id="permissions" data-testid="root" />);
    expect(trigger()).toHaveTextContent('Select…');
    expect(trigger()).toHaveAttribute('aria-haspopup', 'listbox');
    expect(trigger()).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
    expect(ref.current).toBe(screen.getByTestId('root'));
    expect(ref.current).toHaveClass('motiv-multi-select', 'custom');
    expect(ref.current).toHaveAttribute('id', 'permissions');
  });

  it('focuses search on open and filters by label and hint without losing selection', () => {
    const { container } = render(<Controlled />);
    fireEvent.click(trigger());
    expect(search()).toHaveFocus();
    expect(search()).toHaveAttribute('aria-autocomplete', 'list');
    expect(search()).toHaveAttribute('aria-expanded', 'true');
    expect(search()).toHaveAttribute('aria-controls', screen.getByRole('listbox').id);
    expect(screen.getByRole('listbox')).toHaveAttribute('aria-multiselectable', 'true');
    expect(container.querySelector('[aria-live]')).toHaveTextContent('5 results');
    filter('wRi');
    expect(screen.getAllByRole('option')).toHaveLength(1);
    key('Enter');
    expect(screen.getByRole('option')).toHaveAttribute('aria-selected', 'true');
    filter('VIEW');
    expect(screen.getByRole('option')).toHaveTextContent('Read');
    filter('');
    expect(screen.getByRole('option', { name: 'Write Edit entries' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(trigger()).toHaveAttribute('aria-expanded', 'true');
  });

  it('moves with arrows and pages, clamps to the list, and toggles with Enter', () => {
    render(<Controlled />);
    fireEvent.click(trigger());
    expect(active()).toHaveTextContent('Read');
    key('ArrowUp');
    expect(active()).toHaveTextContent('Read');
    key('ArrowDown');
    expect(active()).toHaveTextContent('Write');
    key('Enter');
    expect(active()).toHaveAttribute('aria-selected', 'true');
    key('Enter');
    expect(active()).toHaveAttribute('aria-selected', 'false');
    key('PageDown');
    expect(active()).toHaveTextContent('Delete');
    key('ArrowDown');
    expect(active()).toHaveTextContent('Delete');
    key('PageUp');
    expect(active()).toHaveTextContent('Read');
    expect(key('Home')).toBe(true);
    expect(key('End')).toBe(true);
    expect(active()).toHaveTextContent('Read');
    expect(search()).toHaveFocus();
  });

  it('pages through a long list in ten-row steps', () => {
    render(
      <Controlled
        options={Array.from({ length: 300 }, (_, i) => ({ value: `${i}`, label: `Option ${i}` }))}
      />,
    );
    fireEvent.click(trigger());
    key('PageDown');
    expect(active()).toHaveTextContent('Option 10');
    key('PageDown');
    key('PageUp');
    expect(active()).toHaveTextContent('Option 10');
  });

  it('ignores Enter and Backspace during IME composition', () => {
    const onChange = vi.fn();
    render(<Controlled value={['write']} onChange={onChange} />);
    fireEvent.click(trigger());
    fireEvent.keyDown(search(), { key: 'Enter', isComposing: true });
    fireEvent.keyDown(search(), { key: 'Backspace', isComposing: true });
    expect(onChange).not.toHaveBeenCalled();
  });

  it('removes only the last value on empty-query Backspace', () => {
    render(<Controlled value={['read', 'unknown']} />);
    fireEvent.click(trigger());
    filter('read');
    expect(key('Backspace')).toBe(true);
    expect(screen.getByRole('button', { name: 'Remove unknown' })).toBeInTheDocument();
    filter('');
    key('Backspace');
    expect(screen.queryByRole('button', { name: 'Remove unknown' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Remove Read' })).toBeInTheDocument();
    key('Backspace');
    key('Backspace');
    expect(trigger()).toHaveTextContent('Select…');
  });

  it('closes with Escape and restores trigger focus, resetting search on reopen', () => {
    render(<Controlled />);
    fireEvent.click(trigger());
    filter('write');
    key('Escape');
    expect(trigger()).toHaveAttribute('aria-expanded', 'false');
    expect(trigger()).toHaveFocus();
    fireEvent.click(trigger());
    expect(search()).toHaveValue('');
    expect(active()).toHaveTextContent('Read');
  });

  it('closes when the open trigger is clicked without reopening after input blur', () => {
    render(<Controlled />);
    fireEvent.click(trigger());
    expect(fireEvent.pointerDown(trigger())).toBe(false);
    expect(search()).toHaveFocus();
    fireEvent.click(trigger());
    expect(trigger()).toHaveAttribute('aria-expanded', 'false');
    expect(trigger()).toHaveFocus();
  });

  it('dismisses on outside pointerdown and leaves focus on the clicked target', () => {
    render(<Controlled />);
    fireEvent.click(trigger());
    const outside = screen.getByRole('button', { name: 'Outside' });
    fireEvent.pointerDown(outside);
    act(() => outside.focus());
    expect(trigger()).toHaveAttribute('aria-expanded', 'false');
    expect(outside).toHaveFocus();
    fireEvent.keyDown(outside, { key: 'Escape' });
    expect(outside).toHaveFocus();
  });

  it('restores trigger focus when closing after focus leaves the browser window', () => {
    render(<Controlled />);
    fireEvent.click(trigger());
    fireEvent.blur(search(), { relatedTarget: null });
    expect(trigger()).toHaveAttribute('aria-expanded', 'false');
    expect(trigger()).toHaveFocus();
  });

  it('closes on Tab-out and preserves the next target focus', () => {
    render(<Controlled value={['read']} />);
    fireEvent.click(trigger());
    expect(key('Tab')).toBe(true);
    const outside = screen.getByRole('button', { name: 'Outside' });
    act(() => outside.focus());
    expect(trigger()).toHaveAttribute('aria-expanded', 'false');
    expect(outside).toHaveFocus();
    fireEvent.click(trigger());
    fireEvent.keyDown(search(), { key: 'Tab', shiftKey: true });
    const chip = screen.getByRole('button', { name: 'Remove Read' });
    act(() => chip.focus());
    expect(trigger()).toHaveAttribute('aria-expanded', 'false');
    expect(chip).toHaveFocus();
  });

  it('excludes the listbox from Tab order and closes when focus leaves it', () => {
    render(<Controlled />);
    fireEvent.click(trigger());
    const listbox = screen.getByRole('listbox');
    expect(listbox).toHaveAttribute('tabindex', '-1');
    act(() => listbox.focus());
    expect(listbox).toHaveFocus();
    expect(trigger()).toHaveAttribute('aria-expanded', 'true');
    const outside = screen.getByRole('button', { name: 'Outside' });
    act(() => outside.focus());
    expect(trigger()).toHaveAttribute('aria-expanded', 'false');
    expect(outside).toHaveFocus();
    fireEvent.keyDown(outside, { key: 'Escape' });
    expect(outside).toHaveFocus();
  });

  it('keeps search focused and the panel open when clicking a row', () => {
    render(<Controlled />);
    fireEvent.click(trigger());
    const option = screen.getByRole('option', { name: 'Read View entries' });
    expect(fireEvent.pointerDown(option)).toBe(false);
    fireEvent.click(option);
    expect(option).toHaveAttribute('aria-selected', 'true');
    expect(search()).toHaveFocus();
    expect(trigger()).toHaveAttribute('aria-expanded', 'true');
  });

  it('keeps search focused on panel padding and empty text while allowing input clicks', () => {
    const { container } = render(<Controlled />);
    fireEvent.click(trigger());
    const panel = container.querySelector('[popover]') as HTMLDivElement;
    expect(fireEvent.pointerDown(panel)).toBe(false);
    fireEvent.click(panel);
    expect(search()).toHaveFocus();
    expect(trigger()).toHaveAttribute('aria-expanded', 'true');
    filter('missing');
    const empty = screen.getByText('No matches', { selector: 'p' });
    expect(fireEvent.pointerDown(empty)).toBe(false);
    fireEvent.click(empty);
    expect(search()).toHaveFocus();
    expect(trigger()).toHaveAttribute('aria-expanded', 'true');
    expect(fireEvent.pointerDown(search())).toBe(true);
  });

  it('renders three sibling remove buttons and the remaining count', () => {
    render(<Controlled value={options.map((option) => option.value)} />);
    expect(screen.getAllByRole('button', { name: /^Remove / })).toHaveLength(3);
    expect(screen.getByText('+2 more')).toBeInTheDocument();
    expect(trigger()).toHaveTextContent('5 selected');
    const chip = screen.getByRole('button', { name: 'Remove Write' });
    expect(chip.parentElement).toBe(trigger().parentElement);
    expect(trigger().querySelector('button')).toBeNull();
    fireEvent.click(chip);
    expect(screen.queryByRole('button', { name: 'Remove Write' })).not.toBeInTheDocument();
    expect(screen.getByText('+1 more')).toBeInTheDocument();
    expect(trigger()).toHaveFocus();
  });

  it('honors controlled updates and preserves unknown values when toggling', () => {
    const onChange = vi.fn();
    const { rerender } = render(
      <MultiSelect label="Permissions" options={options} value={['unknown']} onChange={onChange} />,
    );
    fireEvent.click(trigger());
    key('Enter');
    expect(onChange).toHaveBeenLastCalledWith(['unknown', 'read']);
    expect(active()).toHaveAttribute('aria-selected', 'false');
    rerender(
      <MultiSelect
        label="Permissions"
        options={options}
        value={['unknown', 'read']}
        onChange={onChange}
      />,
    );
    expect(active()).toHaveAttribute('aria-selected', 'true');
    key('Enter');
    expect(onChange).toHaveBeenLastCalledWith(['unknown']);
  });

  it('keeps the active descendant valid after filtering and option updates', () => {
    const { rerender } = render(<Controlled />);
    fireEvent.click(trigger());
    key('PageDown');
    filter('write');
    expect(active()).toHaveTextContent('Write');
    filter('missing');
    expect(search()).not.toHaveAttribute('aria-activedescendant');
    expect(screen.getByText('No matches', { selector: 'p' })).toBeInTheDocument();
    key('Enter');
    key('ArrowDown');
    expect(search()).not.toHaveAttribute('aria-activedescendant');
    filter('');
    key('PageDown');
    rerender(<Controlled options={options.slice(0, 1)} />);
    expect(active()).toHaveTextContent('Read');
    rerender(<Controlled options={[]} />);
    expect(search()).not.toHaveAttribute('aria-activedescendant');
  });

  it('disables the trigger, chips and form fields and closes when disabled', () => {
    const { rerender, container } = render(
      <Controlled value={['read']} name="permission" disabled />,
    );
    expect(trigger()).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Remove Read' })).toBeDisabled();
    expect(container.querySelector('input[type="hidden"]')).toBeDisabled();
    fireEvent.click(trigger());
    expect(trigger()).toHaveAttribute('aria-expanded', 'false');
    rerender(<Controlled />);
    fireEvent.click(trigger());
    rerender(<Controlled disabled />);
    expect(trigger()).toHaveAttribute('aria-expanded', 'false');
    rerender(<Controlled />);
    expect(trigger()).toHaveAttribute('aria-expanded', 'false');
  });

  it('submits repeated hidden inputs, including values absent from options', () => {
    const { container, rerender } = render(
      <form>
        <Controlled value={['read', 'unknown']} name="permission" />
      </form>,
    );
    const form = container.querySelector('form') as HTMLFormElement;
    expect(new FormData(form).getAll('permission')).toEqual(['read', 'unknown']);
    fireEvent.click(screen.getByRole('button', { name: 'Remove Read' }));
    expect(new FormData(form).getAll('permission')).toEqual(['unknown']);
    rerender(
      <form>
        <Controlled name="permission" disabled />
      </form>,
    );
    expect(new FormData(form).getAll('permission')).toEqual([]);
  });

  it('uses all supplied strings and count formatters', () => {
    const strings = {
      placeholder: 'Choose permissions',
      searchLabel: 'Find a permission',
      emptyText: 'Nothing found',
      removeLabel: (label: string) => `Discard ${label}`,
      moreLabel: (count: number) => `${count} additional`,
      selectedLabel: (count: number) => `${count} chosen`,
      resultsLabel: (count: number) => `Matches: ${count}`,
    };
    const { container, rerender } = render(<Controlled {...strings} />);
    expect(trigger()).toHaveTextContent(strings.placeholder);
    rerender(<Controlled {...strings} value={[]} />);
    fireEvent.click(trigger());
    const input = screen.getByRole('combobox', { name: strings.searchLabel });
    expect(container.querySelector('[aria-live]')).toHaveTextContent('Matches: 5');
    fireEvent.change(input, { target: { value: 'absent' } });
    expect(container.querySelector('[aria-live]')).toHaveTextContent(strings.emptyText);
    expect(screen.getByText(strings.emptyText, { selector: 'p' })).toBeInTheDocument();
    rerender(
      <MultiSelect
        label="Permissions"
        options={options}
        value={options.map((option) => option.value)}
        onChange={() => {}}
        {...strings}
      />,
    );
    expect(screen.getByRole('button', { name: 'Discard Read' })).toBeInTheDocument();
    expect(screen.getByText('2 additional')).toBeInTheDocument();
    expect(trigger()).toHaveTextContent('5 chosen');
  });

  it('uses native popovers, flips above, and repositions on scroll and resize only while open', () => {
    const { container, unmount } = render(<Controlled />);
    const panel = container.querySelector('[popover]') as HTMLDivElement;
    panel.showPopover = vi.fn();
    panel.hidePopover = vi.fn();
    const rect = vi.spyOn(trigger(), 'getBoundingClientRect').mockReturnValue({
      top: window.innerHeight - 60,
      bottom: window.innerHeight - 12,
      left: 24,
      width: 240,
    } as DOMRect);
    vi.spyOn(panel, 'getBoundingClientRect').mockReturnValue({ height: 200 } as DOMRect);
    fireEvent.click(trigger());
    expect(panel.showPopover).toHaveBeenCalledOnce();
    expect(panel.style.top).toBe(`${window.innerHeight - 260}px`);
    expect(panel.style.left).toBe('24px');
    expect(panel.style.width).toBe('240px');
    rect.mockReturnValue({ top: 20, bottom: 68, left: 30, width: 300 } as DOMRect);
    fireEvent.scroll(container);
    expect(panel.style.top).toBe('68px');
    expect(panel.style.left).toBe('30px');
    expect(panel.style.width).toBe('300px');
    fireEvent(window, new Event('resize'));
    expect(rect).toHaveBeenCalledTimes(3);
    fireEvent.scroll(screen.getByRole('listbox'));
    expect(rect).toHaveBeenCalledTimes(3);
    key('Escape');
    expect(panel.hidePopover).toHaveBeenCalledOnce();
    fireEvent.scroll(container);
    fireEvent(window, new Event('resize'));
    expect(rect).toHaveBeenCalledTimes(3);
    fireEvent.click(trigger());
    unmount();
    expect(panel.hidePopover).toHaveBeenCalledTimes(2);
  });
});
