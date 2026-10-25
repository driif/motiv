import {
  type ComponentProps,
  type ReactNode,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { cx } from '../../utils/cx';

export type MultiSelectProps = Omit<ComponentProps<'div'>, 'onChange'> & {
  label: ReactNode;
  options: { value: string; label: string; hint?: string }[];
  value: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  name?: string;
  searchLabel?: string;
  emptyText?: string;
  removeLabel?: (label: string) => string;
  moreLabel?: (count: number) => string;
  selectedLabel?: (count: number) => string;
  resultsLabel?: (count: number) => string;
};

export function MultiSelect({
  label,
  options,
  value,
  onChange,
  placeholder = 'Select…',
  disabled,
  name,
  searchLabel = 'Search',
  emptyText = 'No matches',
  removeLabel = (label) => `Remove ${label}`,
  moreLabel = (count) => `+${count} more`,
  selectedLabel = (count) => `${count} selected`,
  resultsLabel = (count) => `${count} results`,
  className,
  ...props
}: MultiSelectProps) {
  const id = useId();
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

  useLayoutEffect(() => {
    if (!isOpen) {
      setExpanded(false);
      return;
    }
    const panel = panelRef.current;
    const search = searchRef.current;
    panel?.showPopover?.();
    search?.focus({ preventScroll: true });

    function dismiss(event: PointerEvent) {
      if (!triggerRef.current?.parentElement?.contains(event.target as Node)) setExpanded(false);
    }
    function closeOnEscape(event: KeyboardEvent) {
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
      panel?.hidePopover?.();
    };
  }, [isOpen]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: a filtered list changes the panel height.
  useLayoutEffect(() => {
    if (!isOpen) return;
    function position(event?: Event) {
      const trigger = triggerRef.current;
      const panel = panelRef.current;
      // Scrolling the list itself must not re-measure: clearing maxHeight clamps its scrollTop.
      if (!trigger || !panel || (event?.target instanceof Node && panel.contains(event.target)))
        return;
      const rect = trigger.getBoundingClientRect();
      panel.style.width = `${rect.width}px`;
      panel.style.maxHeight = '';
      const height = panel.getBoundingClientRect().height;
      const below = window.innerHeight - rect.bottom;
      const above = rect.top;
      const flip = height > below && above > below;
      const available = Math.max(0, flip ? above : below);
      panel.style.maxHeight = `${Math.min(height, available)}px`;
      panel.style.top = `${flip ? Math.max(0, rect.top - height) : rect.bottom}px`;
      panel.style.left = `${rect.left}px`;
    }
    position();
    window.addEventListener('scroll', position, true);
    window.addEventListener('resize', position);
    return () => {
      window.removeEventListener('scroll', position, true);
      window.removeEventListener('resize', position);
    };
  }, [isOpen, filtered.length]);

  useLayoutEffect(() => {
    if (isOpen) listRef.current?.children[current]?.scrollIntoView?.({ block: 'nearest' });
  }, [isOpen, current]);

  function toggle(item: string) {
    onChange(value.includes(item) ? value.filter((entry) => entry !== item) : [...value, item]);
  }

  return (
    <div {...props} className={cx('motiv-multi-select', className)}>
      <span id={`${id}-label`} className="motiv-multi-select__label">
        {label}
      </span>
      <button
        ref={triggerRef}
        type="button"
        aria-labelledby={`${id}-label ${id}-summary`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={`${id}-list`}
        disabled={disabled}
        className="motiv-multi-select__trigger"
        onPointerDown={(event) => {
          if (isOpen) event.preventDefault();
        }}
        onClick={() => {
          setQuery('');
          setActiveIndex(0);
          setExpanded(!isOpen);
          if (isOpen) triggerRef.current?.focus({ preventScroll: true });
        }}
      >
        <span
          id={`${id}-summary`}
          className={cx(
            'motiv-multi-select__summary',
            !value.length && 'motiv-multi-select__summary--empty',
          )}
        >
          {value.length ? selectedLabel(value.length) : placeholder}
        </span>
        <svg className="motiv-multi-select__icon" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {chips.map((chip) => (
        <button
          key={chip.value}
          type="button"
          disabled={disabled}
          className="motiv-multi-select__chip"
          aria-label={removeLabel(chip.label)}
          onClick={() => {
            onChange(value.filter((item) => item !== chip.value));
            triggerRef.current?.focus({ preventScroll: true });
          }}
        >
          <span className="motiv-multi-select__summary">{chip.label}</span>
          <svg className="motiv-multi-select__icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="m7 7 10 10M7 17 17 7" />
          </svg>
        </button>
      ))}
      {value.length > 3 && (
        <span className="motiv-multi-select__more">{moreLabel(value.length - 3)}</span>
      )}
      <div
        ref={panelRef}
        popover="manual"
        hidden={!isOpen}
        className="motiv-multi-select__panel"
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setExpanded(false);
        }}
        onPointerDown={(event) => {
          if (event.target !== searchRef.current) event.preventDefault();
        }}
      >
        <input
          ref={searchRef}
          type="text"
          role="combobox"
          aria-label={searchLabel}
          aria-autocomplete="list"
          aria-expanded={isOpen}
          aria-controls={`${id}-list`}
          aria-activedescendant={isOpen && current >= 0 ? `${id}-option-${current}` : undefined}
          className="motiv-multi-select__search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setActiveIndex(0);
          }}
          onKeyDown={(event) => {
            if (event.nativeEvent.isComposing) return;
            switch (event.key) {
              case 'ArrowDown':
              case 'ArrowUp':
              case 'PageDown':
              case 'PageUp': {
                event.preventDefault();
                const step = event.key.startsWith('Page') ? 10 : 1;
                const direction = event.key.endsWith('Down') ? 1 : -1;
                setActiveIndex(
                  Math.max(0, Math.min(filtered.length - 1, current + step * direction)),
                );
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
          }}
        />
        <ul
          ref={listRef}
          id={`${id}-list`}
          role="listbox"
          tabIndex={-1}
          aria-labelledby={`${id}-label`}
          aria-multiselectable="true"
          className="motiv-multi-select__list"
        >
          {filtered.map((option, index) => (
            <li
              key={option.value}
              id={`${id}-option-${index}`}
              role="option"
              aria-selected={value.includes(option.value)}
              className={cx(
                'motiv-multi-select__option',
                index === current && 'motiv-multi-select__option--active',
              )}
              onClick={() => {
                setActiveIndex(index);
                toggle(option.value);
              }}
            >
              <svg className="motiv-multi-select__check" viewBox="0 0 24 24" aria-hidden="true">
                <path d="m5 12 4 4L19 6" />
              </svg>
              <span>
                {option.label}{' '}
                {option.hint && <span className="motiv-multi-select__hint">{option.hint}</span>}
              </span>
            </li>
          ))}
        </ul>
        {!filtered.length && <p className="motiv-multi-select__empty">{emptyText}</p>}
      </div>
      <span className="motiv-visually-hidden" aria-live="polite" aria-atomic="true">
        {isOpen ? (filtered.length ? resultsLabel(filtered.length) : emptyText) : ''}
      </span>
      {name &&
        value.map((item) => (
          <input key={item} type="hidden" name={name} value={item} disabled={disabled} />
        ))}
    </div>
  );
}
