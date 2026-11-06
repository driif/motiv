import { useId } from 'react';
import type { MultiSelectProps } from '../../components/MultiSelect';
import { cx } from '../../utils/cx';
import { useMultiSelect } from '../../utils/useMultiSelect';

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
  const { listRef, isOpen, filtered, current, chips, select, remove, trigger, panel, search } =
    useMultiSelect({ options, value, onChange, disabled });

  return (
    <div {...props} className={cx('motiv-matrix-multi-select', className)}>
      <span id={`${id}-label`} className="motiv-matrix-multi-select__label">
        {label}
      </span>
      <button
        {...trigger}
        type="button"
        aria-labelledby={`${id}-label ${id}-summary`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={`${id}-list`}
        disabled={disabled}
        className="motiv-matrix-multi-select__trigger"
      >
        <span className="motiv-matrix-multi-select__prompt" aria-hidden="true">
          &gt;
        </span>
        <span
          id={`${id}-summary`}
          className={cx(
            'motiv-matrix-multi-select__summary',
            !value.length && 'motiv-matrix-multi-select__summary--empty',
          )}
        >
          {value.length ? selectedLabel(value.length) : placeholder}
        </span>
        <svg className="motiv-matrix-multi-select__arrow" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {chips.map((chip) => (
        <button
          key={chip.value}
          type="button"
          disabled={disabled}
          className="motiv-matrix-multi-select__chip"
          aria-label={removeLabel(chip.label)}
          onClick={() => remove(chip.value)}
        >
          <span className="motiv-matrix-multi-select__summary">{chip.label}</span>
          <span className="motiv-matrix-multi-select__cross" aria-hidden="true">
            ×
          </span>
        </button>
      ))}
      {value.length > 3 && (
        <span className="motiv-matrix-multi-select__more">{moreLabel(value.length - 3)}</span>
      )}
      <div
        {...panel}
        popover="manual"
        hidden={!isOpen}
        className="motiv-matrix-multi-select__panel"
      >
        <input
          {...search}
          type="text"
          role="combobox"
          aria-label={searchLabel}
          aria-autocomplete="list"
          aria-expanded={isOpen}
          aria-controls={`${id}-list`}
          aria-activedescendant={isOpen && current >= 0 ? `${id}-option-${current}` : undefined}
          className="motiv-matrix-multi-select__search"
        />
        <ul
          ref={listRef}
          id={`${id}-list`}
          role="listbox"
          tabIndex={-1}
          aria-labelledby={`${id}-label`}
          aria-multiselectable="true"
          className="motiv-matrix-multi-select__list"
        >
          {filtered.map((option, index) => (
            <li
              key={option.value}
              id={`${id}-option-${index}`}
              role="option"
              aria-selected={value.includes(option.value)}
              className={cx(
                'motiv-matrix-multi-select__option',
                index === current && 'motiv-matrix-multi-select__option--active',
              )}
              onClick={() => select(index)}
            >
              <span className="motiv-matrix-multi-select__box" aria-hidden="true" />
              <span>
                {option.label}{' '}
                {option.hint && (
                  <span className="motiv-matrix-multi-select__hint">{option.hint}</span>
                )}
              </span>
            </li>
          ))}
        </ul>
        {!filtered.length && <p className="motiv-matrix-multi-select__empty">{emptyText}</p>}
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
