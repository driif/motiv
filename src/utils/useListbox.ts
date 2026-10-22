import { type KeyboardEvent, useEffect, useRef, useState } from 'react';

const PAGE = 10;

/** Select-only combobox state and keyboard (APG). Typeahead reads `[data-listbox-label]` text. */
export function useListbox(
  options: { value: string }[],
  value: string,
  onChange: (value: string) => void,
  disabled?: boolean,
) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const anchorRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const search = useRef('');
  const searchTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const selectedIndex = options.findIndex((option) => option.value === value);
  // Options or disabled can change while open; derive instead of trusting stale state.
  const isOpen = open && !disabled && options.length > 0;
  if (open && !isOpen) setOpen(false);
  const current = Math.min(active, options.length - 1);

  useEffect(() => {
    if (!isOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!anchorRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) listRef.current?.children[current]?.scrollIntoView?.({ block: 'nearest' });
  }, [isOpen, current]);

  useEffect(() => () => clearTimeout(searchTimer.current), []);

  function show(index = Math.max(selectedIndex, 0)) {
    if (!options.length) return;
    setActive(index);
    setOpen(true);
  }

  function commit(index: number) {
    const option = options[index];
    if (option) onChange(option.value);
    setOpen(false);
  }

  function typeahead(char: string) {
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      search.current = '';
    }, 500);
    search.current += char.toLowerCase();
    const labels = listRef.current?.querySelectorAll('[data-listbox-label]') ?? [];
    // Repeating one key ("bbb") cycles through matches past the current option, as in APG.
    const repeated = [...search.current].every((c) => c === search.current[0]);
    const query = repeated ? search.current[0] : search.current;
    const start = Math.max((isOpen ? current : selectedIndex) + (repeated ? 1 : 0), 0);
    for (let n = 0; n < options.length; n++) {
      const i = (start + n) % options.length;
      if (labels[i]?.textContent?.toLowerCase().startsWith(query)) return show(i);
    }
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const { key } = event;
    const last = options.length - 1;
    if (key.length === 1 && key !== ' ' && !event.ctrlKey && !event.metaKey && !event.altKey) {
      typeahead(key);
      return;
    }
    if (key === ' ' && search.current) {
      event.preventDefault();
      typeahead(key);
      return;
    }
    if (!isOpen) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(key)) {
        event.preventDefault();
        show();
      }
      return;
    }
    switch (key) {
      case 'ArrowDown':
        event.preventDefault();
        setActive(Math.min(current + 1, last));
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (event.altKey) commit(current);
        else setActive(Math.max(current - 1, 0));
        break;
      case 'Home':
        event.preventDefault();
        setActive(0);
        break;
      case 'End':
        event.preventDefault();
        setActive(last);
        break;
      case 'PageUp':
        event.preventDefault();
        setActive(Math.max(current - PAGE, 0));
        break;
      case 'PageDown':
        event.preventDefault();
        setActive(Math.min(current + PAGE, last));
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        commit(current);
        break;
      case 'Tab':
        commit(current);
        break;
      case 'Escape':
        event.preventDefault();
        setOpen(false);
        break;
    }
  }

  return {
    anchorRef,
    listRef,
    isOpen,
    current,
    selectedIndex,
    setActive,
    commit,
    trigger: {
      onClick: () => (isOpen ? setOpen(false) : show()),
      onKeyDown,
      // Firefox can still fire a click on Space keyup after keydown was prevented.
      onKeyUp: (event: KeyboardEvent<HTMLButtonElement>) => {
        if (event.key === ' ') event.preventDefault();
      },
    },
  };
}
