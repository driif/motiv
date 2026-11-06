import { act, fireEvent, render, screen } from '@testing-library/react';
import { createRef, useState } from 'react';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import type { MultiSelectProps } from '../../components/MultiSelect';
import { MultiSelect } from './MultiSelect';

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
    expect(ref.current).toHaveClass('motiv-sketch-multi-select', 'custom');
    expect(ref.current).toHaveAttribute('id', 'permissions');
  });

  it('focuses search on open and filters by label and hint without losing selection', () => {
    const { container } = render(<Controlled />);
    fireEvent.click(trigger());
    expect(search()).toHaveFocus();
    expect(search()).toHaveAttribute('aria-autocomplete', 'list');
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
  });

  it('moves with arrows and pages, clamps to the list, and toggles with Enter', () => {
    render(<Controlled />);
    fireEvent.click(trigger());
    expect(active()).toHaveTextContent('Read');
    key('ArrowUp');
    expect(active()).toHaveTextContent('Read');
    key('ArrowDown');
    key('Enter');
    expect(active()).toHaveTextContent('Write');
    expect(active()).toHaveAttribute('aria-selected', 'true');
    key('PageDown');
    expect(active()).toHaveTextContent('Delete');
    key('PageUp');
    expect(active()).toHaveTextContent('Read');
  });

  it('removes only the last value on empty-query Backspace', () => {
    render(<Controlled value={['read', 'unknown']} />);
    fireEvent.click(trigger());
    filter('read');
    key('Backspace');
    expect(screen.getByRole('button', { name: 'Remove unknown' })).toBeInTheDocument();
    filter('');
    key('Backspace');
    expect(screen.queryByRole('button', { name: 'Remove unknown' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Remove Read' })).toBeInTheDocument();
  });

  it('closes with Escape or an outside pointerdown, restoring focus only for Escape', () => {
    render(<Controlled />);
    fireEvent.click(trigger());
    key('Escape');
    expect(trigger()).toHaveAttribute('aria-expanded', 'false');
    expect(trigger()).toHaveFocus();
    fireEvent.click(trigger());
    const outside = screen.getByRole('button', { name: 'Outside' });
    fireEvent.pointerDown(outside);
    act(() => outside.focus());
    expect(trigger()).toHaveAttribute('aria-expanded', 'false');
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

  it('renders three sibling remove buttons and the remaining count', () => {
    render(<Controlled value={options.map((option) => option.value)} />);
    expect(screen.getAllByRole('button', { name: /^Remove / })).toHaveLength(3);
    expect(screen.getByText('+2 more')).toBeInTheDocument();
    expect(trigger()).toHaveTextContent('5 selected');
    fireEvent.click(screen.getByRole('button', { name: 'Remove Write' }));
    expect(screen.getByText('+1 more')).toBeInTheDocument();
    expect(trigger()).toHaveFocus();
  });

  it('disables the trigger, chips and form fields and submits repeated hidden inputs', () => {
    const { container, rerender } = render(
      <form>
        <Controlled value={['read', 'unknown']} name="permission" />
      </form>,
    );
    const form = container.querySelector('form') as HTMLFormElement;
    expect(new FormData(form).getAll('permission')).toEqual(['read', 'unknown']);
    rerender(
      <form>
        <Controlled value={['read', 'unknown']} name="permission" disabled />
      </form>,
    );
    expect(trigger()).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Remove Read' })).toBeDisabled();
    expect(new FormData(form).getAll('permission')).toEqual([]);
    fireEvent.click(trigger());
    expect(trigger()).toHaveAttribute('aria-expanded', 'false');
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
    fireEvent.click(trigger());
    const input = screen.getByRole('combobox', { name: strings.searchLabel });
    expect(container.querySelector('[aria-live]')).toHaveTextContent('Matches: 5');
    fireEvent.change(input, { target: { value: 'absent' } });
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

  it('opens in the top layer, flips above near the viewport bottom and follows scroll', () => {
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
    Object.defineProperty(panel, 'offsetHeight', { value: 200 });
    fireEvent.click(trigger());
    expect(panel.showPopover).toHaveBeenCalledOnce();
    expect(panel.style.top).toBe(`${window.innerHeight - 260}px`);
    expect(panel.style.width).toBe('240px');
    rect.mockReturnValue({ top: 20, bottom: 68, left: 30, width: 300 } as DOMRect);
    fireEvent.scroll(container);
    expect(panel.style.top).toBe('68px');
    expect(panel.style.left).toBe('30px');
    key('Escape');
    expect(panel.hidePopover).toHaveBeenCalledOnce();
    unmount();
  });
});
