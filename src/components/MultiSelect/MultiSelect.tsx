import { type ComponentProps, type ReactNode, useId } from 'react';
import { cx } from '../../utils/cx';
import { useMultiSelect } from '../../utils/useMultiSelect';

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
  const { listRef, isOpen, filtered, current, chips, select, remove, trigger, panel, search } =
    useMultiSelect({ options, value, onChange, disabled });

  return (
    <div {...props} className={cx('motiv-multi-select', className)}>
      <span id={`${id}-label`} className="motiv-multi-select__label">
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
        className="motiv-multi-select__trigger"
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
          onClick={() => remove(chip.value)}
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
      <div {...panel} popover="manual" hidden={!isOpen} className="motiv-multi-select__panel">
        <input
          {...search}
          type="text"
          role="combobox"
          aria-label={searchLabel}
          aria-autocomplete="list"
          aria-expanded={isOpen}
          aria-controls={`${id}-list`}
          aria-activedescendant={isOpen && current >= 0 ? `${id}-option-${current}` : undefined}
          className="motiv-multi-select__search"
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
              onClick={() => select(index)}
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
