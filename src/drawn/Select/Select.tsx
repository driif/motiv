import {
  type ComponentProps,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';
import { cx } from '../../utils/cx';

export interface SelectProps extends Omit<ComponentProps<'div'>, 'onChange' | 'children'> {
  label: ReactNode;
  options: { value: string; label: ReactNode; code?: string; hint?: ReactNode }[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  name?: string;
}

const PAGE = 10;

export function Select({
  label,
  options,
  value,
  onChange,
  placeholder = 'Select…',
  disabled,
  name,
  className,
  style,
  ...props
}: SelectProps) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const anchorRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const search = useRef('');
  const searchTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const selectedIndex = options.findIndex((option) => option.value === value);
  const selected = options[selectedIndex];
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
    const labels = listRef.current?.querySelectorAll('.motiv-select__option-label') ?? [];
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

  return (
    <div
      className={cx('motiv-select', isOpen && 'motiv-select--open', className)}
      style={{ ...style, '--_count': options.length } as CSSProperties}
      {...props}
    >
      <span id={`${id}-label`} className="motiv-select__label">
        {label}
      </span>
      <div ref={anchorRef} className="motiv-select__anchor">
        <button
          type="button"
          role="combobox"
          aria-labelledby={`${id}-label`}
          aria-describedby={selected?.hint ? `${id}-hint` : undefined}
          aria-controls={`${id}-list`}
          aria-expanded={isOpen}
          aria-activedescendant={isOpen ? `${id}-option-${current}` : undefined}
          disabled={disabled}
          className="motiv-select__trigger"
          onClick={() => (isOpen ? setOpen(false) : show())}
          onKeyDown={onKeyDown}
          // Firefox can still fire a click on Space keyup after keydown was prevented.
          onKeyUp={(event) => event.key === ' ' && event.preventDefault()}
        >
          {selected?.code && <span className="motiv-select__code">{selected.code}</span>}
          <span className={cx('motiv-select__value', !selected && 'motiv-select__value--empty')}>
            {selected ? selected.label : placeholder}
          </span>
          <svg className="motiv-select__fan" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 7h14M5 12h14M5 17h14" />
          </svg>
        </button>
        <ul
          ref={listRef}
          id={`${id}-list`}
          role="listbox"
          aria-labelledby={`${id}-label`}
          inert={!isOpen}
          className="motiv-select__list"
          // Keeps focus on the combobox when an option is clicked.
          onMouseDown={(event) => event.preventDefault()}
        >
          {options.map((option, i) => (
            <li
              key={option.value}
              id={`${id}-option-${i}`}
              role="option"
              aria-selected={i === selectedIndex}
              className={cx(
                'motiv-select__option',
                isOpen && i === current && 'motiv-select__option--active',
              )}
              style={{ '--_i': i, '--_tilt': i % 2 ? -1 : 1 } as CSSProperties}
              onClick={() => commit(i)}
            >
              {option.code && <span className="motiv-select__code">{option.code}</span>}
              <span className="motiv-select__option-label">{option.label}</span>
            </li>
          ))}
        </ul>
      </div>
      {selected?.hint && (
        <p id={`${id}-hint`} className="motiv-select__hint">
          {selected.hint}
        </p>
      )}
      {name && <input type="hidden" name={name} value={value} disabled={disabled} />}
    </div>
  );
}
