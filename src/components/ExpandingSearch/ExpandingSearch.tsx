import {
  type ComponentProps,
  type CSSProperties,
  type KeyboardEvent,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';
import { cx } from '../../utils/cx';
import { Icon } from '../../utils/Icon';

export interface ExpandingSearchProps extends Omit<ComponentProps<'div'>, 'onChange' | 'onSubmit'> {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: (value: string) => void;
  /** Shown while open, filtered by the current value */
  suggestions?: string[];
  onSuggestionSelect?: (suggestion: string) => void;
  label?: string;
  placeholder?: string;
  openLabel?: string;
  closeLabel?: string;
  suggestionsLabel?: string;
  /** Width of the open field in px */
  expandedWidth?: number;
}

export function ExpandingSearch({
  value,
  onChange,
  onSubmit,
  suggestions = [],
  onSuggestionSelect,
  label = 'Search',
  placeholder = 'Search…',
  openLabel = `Open ${label.toLowerCase()}`,
  closeLabel = `Close ${label.toLowerCase()}`,
  suggestionsLabel = 'Suggestions',
  expandedWidth = 290,
  className,
  style,
  onKeyDown,
  ...props
}: ExpandingSearchProps) {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const listId = useId();

  const needle = value.trim().toLowerCase();
  const shown = suggestions.filter((s) => !needle || s.toLowerCase().includes(needle));

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const close = () => {
    setOpen(false);
    toggleRef.current?.focus();
  };

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    onKeyDown?.(event);
    if (event.defaultPrevented || !open) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
    } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      const items = Array.from(listRef.current?.querySelectorAll('button') ?? []);
      if (!items.length) return;
      event.preventDefault();
      const i = items.indexOf(document.activeElement as HTMLButtonElement);
      if (event.key === 'ArrowUp' && i <= 0) inputRef.current?.focus();
      else items[event.key === 'ArrowDown' ? Math.min(i + 1, items.length - 1) : i - 1]?.focus();
    }
  }

  return (
    // biome-ignore lint/a11y/useSemanticElements: <search> has no role in Safari 16 or Chrome 111, the build targets
    <div
      {...props}
      role="search"
      className={cx('motiv-xsearch', className)}
      data-open={open || undefined}
      style={{ ...style, '--_w': `${expandedWidth}px` } as CSSProperties}
      onKeyDown={handleKeyDown}
    >
      <form
        className="motiv-xsearch__bar"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit?.(value);
        }}
      >
        <span className="motiv-xsearch__cap" aria-hidden="true" />
        <span className="motiv-xsearch__body" aria-hidden="true" />
        <span className="motiv-xsearch__cap motiv-xsearch__cap--end" aria-hidden="true" />
        <button
          ref={toggleRef}
          type="button"
          className="motiv-xsearch__toggle"
          aria-label={open ? label : openLabel}
          aria-expanded={open}
          onClick={() => (open ? inputRef.current?.focus() : setOpen(true))}
        >
          <Icon>
            <circle cx="11" cy="11" r="6.5" />
            <path d="M16 16l4.5 4.5" />
          </Icon>
        </button>
        <input
          ref={inputRef}
          className="motiv-xsearch__input"
          type="search"
          value={value}
          placeholder={placeholder}
          aria-label={label}
          aria-controls={shown.length ? listId : undefined}
          disabled={!open}
          onChange={(event) => onChange(event.target.value)}
        />
        <button
          type="button"
          className="motiv-xsearch__close"
          aria-label={closeLabel}
          disabled={!open}
          onClick={() => {
            onChange('');
            close();
          }}
        >
          <Icon>
            <path d="M6 6l12 12M18 6L6 18" />
          </Icon>
        </button>
      </form>

      {shown.length > 0 && (
        <ul ref={listRef} id={listId} className="motiv-xsearch__list" aria-label={suggestionsLabel}>
          {shown.map((suggestion, i) => (
            <li key={suggestion}>
              <button
                type="button"
                className="motiv-xsearch__item"
                style={{ '--_i': i } as CSSProperties}
                disabled={!open}
                onClick={() => {
                  onChange(suggestion);
                  onSuggestionSelect?.(suggestion);
                }}
              >
                <Icon>
                  <path d="M4 7h6l2 2h8v9H4z" />
                </Icon>
                {suggestion}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
