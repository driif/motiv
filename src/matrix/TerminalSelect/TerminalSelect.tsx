import { type ComponentProps, type CSSProperties, type ReactNode, useId } from 'react';
import type { MotivOption } from '../../types';
import { cx } from '../../utils/cx';
import { useListbox } from '../../utils/useListbox';
import { useSelectOptions } from '../../utils/useSelectOptions';

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
  placeholder?: string;
  clearable?: boolean;
  clearLabel?: string;
  disabled?: boolean;
  name?: string;
}

export function TerminalSelect({
  label,
  options,
  value,
  onChange,
  prefix,
  activeLabel = '● active',
  placeholder,
  clearable,
  clearLabel = 'Clear selection',
  disabled,
  name,
  className,
  ...props
}: TerminalSelectProps) {
  const id = useId();
  const items = useSelectOptions(options, clearable, clearLabel);
  const { anchorRef, listRef, isOpen, current, selectedIndex, setActive, commit, trigger } =
    useListbox(items, value, onChange, disabled);
  const selected = items !== options && value === '' ? undefined : items[selectedIndex];

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
          {...trigger}
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
          <span
            className={cx(
              'motiv-matrix-term__value',
              !selected && 'motiv-matrix-term__value--empty',
            )}
          >
            {selected ? (selected.code ?? selected.label) : placeholder}
          </span>
          <span className="motiv-matrix-term__caret" />
          <svg className="motiv-matrix-term__arrow" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
        <div className="motiv-matrix-term__pop">
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
            {items.map((option, i) => (
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
                <span className="motiv-matrix-term__text" data-listbox-label>
                  {option.label}
                </span>
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
