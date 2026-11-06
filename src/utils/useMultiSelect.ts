import {
  type ChangeEvent,
  type FocusEvent,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import type { MultiSelectProps } from '../components/MultiSelect';
import { useAnchoredPopover } from './useAnchoredPopover';

/** Searchable multi-select popover: filtering, active option, keyboard, dismissal and chips. */
export function useMultiSelect({
  options,
  value,
  onChange,
  disabled,
}: Pick<MultiSelectProps, 'options' | 'value' | 'onChange' | 'disabled'>) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const isOpen = expanded && !disabled;
  const filtered = options.filter((option) =>
    `${option.label} ${option.hint ?? ''}`.toLowerCase().includes(query.toLowerCase()),
  );
  const current = Math.min(activeIndex, filtered.length - 1);
  const chips = value.slice(0, 3).map((item) => ({
    value: item,
    label: options.find((option) => option.value === item)?.label ?? item,
  }));

  useAnchoredPopover(triggerRef, panelRef, isOpen, 0, filtered.length);

  useLayoutEffect(() => {
    if (!isOpen) {
      setExpanded(false);
      return;
    }
    const panel = panelRef.current;
    searchRef.current?.focus({ preventScroll: true });

    function dismiss(event: PointerEvent) {
      if (!triggerRef.current?.parentElement?.contains(event.target as Node)) setExpanded(false);
    }
    function closeOnEscape(event: globalThis.KeyboardEvent) {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      event.stopPropagation();
      setExpanded(false);
      triggerRef.current?.focus({ preventScroll: true });
    }
    document.addEventListener('pointerdown', dismiss);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', dismiss);
      document.removeEventListener('keydown', closeOnEscape);
      if (panel?.contains(document.activeElement)) {
        triggerRef.current?.focus({ preventScroll: true });
      }
    };
  }, [isOpen]);

  useLayoutEffect(() => {
    if (isOpen) listRef.current?.children[current]?.scrollIntoView?.({ block: 'nearest' });
  }, [isOpen, current]);

  function toggle(item: string) {
    onChange(value.includes(item) ? value.filter((entry) => entry !== item) : [...value, item]);
  }

  return {
    listRef,
    isOpen,
    query,
    filtered,
    current,
    chips,
    select(index: number) {
      setActiveIndex(index);
      toggle(filtered[index].value);
    },
    remove(item: string) {
      onChange(value.filter((entry) => entry !== item));
      triggerRef.current?.focus({ preventScroll: true });
    },
    trigger: {
      ref: triggerRef,
      onPointerDown: (event: ReactPointerEvent) => {
        if (isOpen) event.preventDefault();
      },
      onClick: () => {
        setQuery('');
        setActiveIndex(0);
        setExpanded(!isOpen);
        if (isOpen) triggerRef.current?.focus({ preventScroll: true });
      },
    },
    panel: {
      ref: panelRef,
      onBlur: (event: FocusEvent<HTMLDivElement>) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setExpanded(false);
      },
      onPointerDown: (event: ReactPointerEvent) => {
        if (event.target !== searchRef.current) event.preventDefault();
      },
    },
    search: {
      ref: searchRef,
      value: query,
      onChange: (event: ChangeEvent<HTMLInputElement>) => {
        setQuery(event.target.value);
        setActiveIndex(0);
      },
      onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.nativeEvent.isComposing) return;
        switch (event.key) {
          case 'ArrowDown':
          case 'ArrowUp':
          case 'PageDown':
          case 'PageUp': {
            event.preventDefault();
            const step = event.key.startsWith('Page') ? 10 : 1;
            const direction = event.key.endsWith('Down') ? 1 : -1;
            setActiveIndex(Math.max(0, Math.min(filtered.length - 1, current + step * direction)));
            break;
          }
          case 'Enter':
            event.preventDefault();
            if (filtered[current]) toggle(filtered[current].value);
            break;
          case 'Backspace':
            if (!query && value.length) {
              event.preventDefault();
              onChange(value.slice(0, -1));
            }
            break;
        }
      },
    },
  };
}
