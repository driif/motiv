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
import type { MotivOption } from '../../types';
import { cx } from '../../utils/cx';
import { playOnce } from '../../utils/motion';

export interface TerminalSelectOption extends MotivOption {
  code?: string;
}

export interface TerminalSelectProps
  extends Omit<ComponentProps<'div'>, 'onChange' | 'children' | 'prefix'> {
  label: ReactNode;
  options: TerminalSelectOption[];
  value: string;
  onChange: (value: string) => void;
  prefix?: string;
  activeLabel?: string;
  disabled?: boolean;
  name?: string;
}

const CRT: Keyframe[] = [
  { opacity: 1, transform: 'scaleX(0)' },
  { opacity: 1, transform: 'scaleX(1)', offset: 0.35 },
  { opacity: 0, transform: 'scaleX(1) scaleY(30)' },
];

export function TerminalSelect({
  label,
  options,
  value,
  onChange,
  prefix,
  activeLabel = '● active',
  disabled,
  name,
  className,
  ...props
}: TerminalSelectProps) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const anchorRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const beamRef = useRef<HTMLSpanElement>(null);
  const selectedIndex = options.findIndex((option) => option.value === value);
  const selected = options[selectedIndex];
  const isOpen = open && !disabled && options.length > 0;
  if (open && !isOpen) setOpen(false);
  const current = Math.min(active, options.length - 1);

  useEffect(() => {
    if (!isOpen) return;
    playOnce(beamRef.current, CRT, { duration: 600 });
    const onPointerDown = (event: PointerEvent) => {
      if (!anchorRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) listRef.current?.children[current]?.scrollIntoView?.({ block: 'nearest' });
  }, [isOpen, current]);

  function show(index = Math.max(selectedIndex, 0)) {
    setActive(index);
    setOpen(true);
  }

  function commit(index: number) {
    const option = options[index];
    if (option) onChange(option.value);
    setOpen(false);
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const { key } = event;
    const last = options.length - 1;
    if (key.length === 1 && key !== ' ' && !event.ctrlKey && !event.metaKey && !event.altKey) {
      // Each letter jumps to the next option whose text starts with it.
      const labels = listRef.current?.querySelectorAll('.motiv-matrix-term__text') ?? [];
      const start = isOpen ? current : selectedIndex;
      for (let n = 1; n <= options.length; n++) {
        const i = (start + n + options.length) % options.length;
        if (labels[i]?.textContent?.toLowerCase().startsWith(key.toLowerCase())) return show(i);
      }
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
        setActive(Math.max(current - 1, 0));
        break;
      case 'Home':
        event.preventDefault();
        setActive(0);
        break;
      case 'End':
        event.preventDefault();
        setActive(last);
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
      {...props}
      className={cx('motiv-matrix-term', isOpen && 'motiv-matrix-term--open', className)}
    >
      <span id={`${id}-label`} className="motiv-matrix-term__label">
        {label}
      </span>
      <div ref={anchorRef} className="motiv-matrix-term__field">
        <button
          type="button"
          role="combobox"
          aria-labelledby={`${id}-label`}
          aria-describedby={selected?.hint ? `${id}-hint` : undefined}
          aria-controls={`${id}-list`}
          aria-expanded={isOpen}
          aria-activedescendant={isOpen ? `${id}-option-${current}` : undefined}
          disabled={disabled}
          className="motiv-matrix-term__trigger"
          onClick={() => (isOpen ? setOpen(false) : show())}
          onKeyDown={onKeyDown}
          // Firefox can still fire a click on Space keyup after keydown was prevented.
          onKeyUp={(event) => event.key === ' ' && event.preventDefault()}
        >
          <span className="motiv-matrix-term__corner motiv-matrix-term__corner--tl" />
          <span className="motiv-matrix-term__corner motiv-matrix-term__corner--tr" />
          <span className="motiv-matrix-term__corner motiv-matrix-term__corner--bl" />
          <span className="motiv-matrix-term__corner motiv-matrix-term__corner--br" />
          {prefix && (
            <span className="motiv-matrix-term__prefix" aria-hidden="true">
              {prefix}
            </span>
          )}
          <span className="motiv-matrix-term__value">{selected?.code ?? selected?.label}</span>
          <span className="motiv-matrix-term__caret" />
          <svg className="motiv-matrix-term__arrow" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
        <div className="motiv-matrix-term__pop">
          <span ref={beamRef} className="motiv-matrix-term__beam" />
          <ul
            ref={listRef}
            id={`${id}-list`}
            role="listbox"
            aria-labelledby={`${id}-label`}
            inert={!isOpen}
            className="motiv-matrix-term__list"
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
                  'motiv-matrix-term__option',
                  isOpen && i === current && 'motiv-matrix-term__option--active',
                )}
                style={{ '--_i': i } as CSSProperties}
                onPointerMove={() => i !== current && setActive(i)}
                onClick={() => commit(i)}
              >
                <span className="motiv-matrix-term__index" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="motiv-matrix-term__text">{option.label}</span>
                {i === selectedIndex && (
                  <span className="motiv-matrix-term__badge" aria-hidden="true">
                    {activeLabel}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
      {selected?.hint && (
        <p id={`${id}-hint`} className="motiv-matrix-term__hint">
          {selected.hint}
        </p>
      )}
      {name && <input type="hidden" name={name} value={value} disabled={disabled} />}
    </div>
  );
}
