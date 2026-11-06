import { act, fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { TerminalSelect } from './TerminalSelect';

const options = [
  { value: 'ldap', label: 'LDAP', code: 'LDAP', hint: 'Directory login' },
  { value: 'oidc', label: 'OIDC' },
  { value: 'okta', label: 'Okta' },
  { value: 'token', label: 'Token' },
];

function Controlled({ initial = 'ldap' }: { initial?: string }) {
  const [value, setValue] = useState(initial);
  return (
    <TerminalSelect
      label="Auth method"
      options={options}
      value={value}
      onChange={setValue}
      prefix="auth://"
      name="auth"
    />
  );
}

const combobox = () => screen.getByRole('combobox', { name: 'Auth method' });
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

describe('TerminalSelect', () => {
  it('is a closed select-only combobox with an inert listbox and a hint', () => {
    render(<Controlled />);
    expect(combobox()).toHaveAttribute('aria-expanded', 'false');
    expect(combobox()).not.toHaveAttribute('aria-activedescendant');
    expect(combobox()).toHaveTextContent('auth://LDAP');
    expect(combobox()).toHaveAccessibleDescription('Directory login');
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
    expect(list.style.top).toBe(`${window.innerHeight - 272}px`);
    expect(list.style.left).toBe('24px');
    expect(list.style.width).toBe('240px');
    expect(list.style.getPropertyValue('--_flip')).toBe('1');
    rect.mockReturnValue({ top: 20, bottom: 68, left: 30, width: 300 } as DOMRect);
    fireEvent.scroll(container);
    expect(list.style.top).toBe('80px');
    expect(list.style.getPropertyValue('--_flip')).toBe('0');
    key('Escape');
    expect(list.hidePopover).toHaveBeenCalledOnce();
    expect(list).toHaveAttribute('hidden');
  });

  it('opens on click and picks a clicked option', () => {
    render(<Controlled />);
    fireEvent.click(combobox());
    expect(combobox()).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('option', { name: 'LDAP' })).toHaveAttribute('aria-selected', 'true');
    fireEvent.click(screen.getByRole('option', { name: 'Okta' }));
    expect(combobox()).toHaveAttribute('aria-expanded', 'false');
    expect(combobox()).toHaveTextContent('Okta');
    expect(document.querySelector('input[type="hidden"]')).toHaveValue('okta');
  });

  it('moves with arrows, Home and End and commits with Enter and Space', () => {
    render(<Controlled initial="oidc" />);
    key('ArrowDown');
    expect(activeOption()).toHaveTextContent('OIDC');
    key('ArrowDown');
    expect(activeOption()).toHaveTextContent('Okta');
    key('End');
    key('ArrowDown');
    expect(activeOption()).toHaveTextContent('Token');
    key('Home');
    key('ArrowUp');
    expect(activeOption()).toHaveTextContent('LDAP');
    key('Enter');
    expect(combobox()).toHaveTextContent('LDAP');
    expect(combobox()).toHaveAttribute('aria-expanded', 'false');
    key(' ');
    key('ArrowDown');
    key(' ');
    expect(combobox()).toHaveTextContent('OIDC');
  });

  it('closes with Escape keeping the value, and commits on Tab', () => {
    render(<Controlled />);
    key('ArrowDown');
    key('ArrowDown');
    key('Escape');
    expect(combobox()).toHaveAttribute('aria-expanded', 'false');
    expect(combobox()).toHaveTextContent('LDAP');
    key('ArrowDown');
    key('End');
    key('Tab');
    expect(combobox()).toHaveTextContent('Token');
  });

  it('types ahead to the next option starting with the letter', () => {
    render(<Controlled />);
    key('o');
    expect(activeOption()).toHaveTextContent('OIDC');
    key('o');
    expect(activeOption()).toHaveTextContent('Okta');
    key('o');
    expect(activeOption()).toHaveTextContent('OIDC');
  });

  it('types ahead on several characters, Space included, and resets after 500ms', () => {
    vi.useFakeTimers();
    render(<Controlled initial="token" />);
    key('o');
    expect(activeOption()).toHaveTextContent('OIDC');
    key('k');
    expect(activeOption()).toHaveTextContent('Okta');
    key(' ');
    expect(combobox()).toHaveAttribute('aria-expanded', 'true');
    expect(combobox()).toHaveTextContent('Token');
    act(() => vi.advanceTimersByTime(500));
    key('l');
    key('d');
    expect(activeOption()).toHaveTextContent('LDAP');
  });

  it('pages with PageUp and PageDown, and Alt+ArrowUp commits and closes', () => {
    render(<Controlled />);
    key('ArrowDown');
    key('PageDown');
    expect(activeOption()).toHaveTextContent('Token');
    key('PageUp');
    expect(activeOption()).toHaveTextContent('LDAP');
    key('ArrowDown');
    key('ArrowUp', { altKey: true });
    expect(combobox()).toHaveAttribute('aria-expanded', 'false');
    expect(combobox()).toHaveTextContent('OIDC');
  });

  it('moves the active option with the pointer', () => {
    render(<Controlled />);
    fireEvent.click(combobox());
    fireEvent.pointerMove(screen.getByRole('option', { name: /OIDC/ }));
    expect(activeOption()).toHaveTextContent('OIDC');
  });

  it('closes on outside pointerdown and stays shut while disabled', () => {
    const { rerender } = render(
      <TerminalSelect label="Auth method" options={options} value="ldap" onChange={() => {}} />,
    );
    fireEvent.click(combobox());
    fireEvent.pointerDown(document.body);
    expect(combobox()).toHaveAttribute('aria-expanded', 'false');
    rerender(
      <TerminalSelect
        label="Auth method"
        options={options}
        value="ldap"
        onChange={() => {}}
        disabled
      />,
    );
    expect(combobox()).toBeDisabled();
  });

  it('shows the placeholder only while nothing is selected', () => {
    const { rerender } = render(
      <TerminalSelect
        label="Auth method"
        options={options}
        value=""
        onChange={() => {}}
        placeholder="Pick one"
      />,
    );
    expect(combobox()).toHaveTextContent('Pick one');
    rerender(
      <TerminalSelect
        label="Auth method"
        options={options}
        value="ldap"
        onChange={() => {}}
        placeholder="Pick one"
      />,
    );
    expect(combobox()).not.toHaveTextContent('Pick one');
  });

  it('shows the active badge with a custom label', () => {
    render(
      <TerminalSelect
        label="Auth method"
        options={options}
        value="okta"
        onChange={() => {}}
        activeLabel="● on"
      />,
    );
    expect(screen.getByText('● on')).toHaveAttribute('aria-hidden', 'true');
  });
});
