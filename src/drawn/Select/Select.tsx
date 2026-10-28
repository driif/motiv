import { type ComponentProps, type CSSProperties, type ReactNode, useId } from 'react';
import { cx } from '../../utils/cx';
import { useListbox } from '../../utils/useListbox';
import { useSelectOptions } from '../../utils/useSelectOptions';

export interface SelectProps extends Omit<ComponentProps<'div'>, 'onChange' | 'children'> {
  label: ReactNode;
  options: { value: string; label: ReactNode; code?: string; hint?: ReactNode }[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  clearable?: boolean;
  clearLabel?: string;
  disabled?: boolean;
  name?: string;
}

export function Select({
  label,
  options,
  value,
  onChange,
  placeholder = 'Select…',
  clearable,
  clearLabel = 'Clear selection',
  disabled,
  name,
  className,
  style,
  ...props
}: SelectProps) {
  const id = useId();
  const items = useSelectOptions(options, clearable, clearLabel);
  const { anchorRef, listRef, isOpen, current, selectedIndex, commit, trigger } = useListbox(
    items,
    value,
    onChange,
    disabled,
  );
  const selected = items !== options && value === '' ? undefined : items[selectedIndex];

  return (
    <div
      className={cx('motiv-select', isOpen && 'motiv-select--open', className)}
      style={{ ...style, '--_count': items.length } as CSSProperties}
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
          {...trigger}
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
          {items.map((option, i) => (
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
              <span className="motiv-select__option-label" data-listbox-label>
                {option.label}
              </span>
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
