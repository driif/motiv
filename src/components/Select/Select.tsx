import { type CSSProperties, useCallback, useId, useLayoutEffect } from 'react';
import type { SelectProps } from '../../drawn/Select';
import { cx } from '../../utils/cx';
import { useListbox } from '../../utils/useListbox';

export function Select({
  label,
  options,
  value,
  onChange,
  placeholder = 'Select…',
  disabled,
  name,
  className,
  ...props
}: SelectProps) {
  const id = useId();
  const { anchorRef, listRef, isOpen, current, selectedIndex, commit, trigger } = useListbox(
    options,
    value,
    onChange,
    disabled,
  );
  const selected = options[selectedIndex];

  const position = useCallback(
    (event?: Event) => {
      const list = listRef.current;
      const anchor = anchorRef.current;
      if (!list || !anchor || (event?.target instanceof Node && list.contains(event.target)))
        return;
      const rect = anchor.getBoundingClientRect();
      list.style.width = `${rect.width}px`;
      const scrollTop = list.scrollTop;
      list.style.maxHeight = '';
      const height = list.offsetHeight;
      const below = window.innerHeight - rect.bottom - 8;
      const above = rect.top - 8;
      const flip = height > below && above > below;
      const available = Math.max(0, flip ? above : below);
      list.style.maxHeight = `${Math.min(height, available)}px`;
      list.scrollTop = scrollTop;
      list.style.top = `${flip ? Math.max(0, rect.top - 8 - height) : rect.bottom + 8}px`;
      list.style.left = `${rect.left}px`;
    },
    [anchorRef, listRef],
  );

  useLayoutEffect(() => {
    if (!isOpen) return;
    const list = listRef.current;
    if (!list) return;
    list.showPopover?.();
    window.addEventListener('scroll', position, true);
    window.addEventListener('resize', position);
    return () => {
      window.removeEventListener('scroll', position, true);
      window.removeEventListener('resize', position);
      list.hidePopover?.();
    };
  }, [isOpen, listRef, position]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: option content changes the list height.
  useLayoutEffect(() => {
    if (isOpen) position();
  }, [isOpen, options, position]);

  return (
    <div {...props} className={cx('motiv-picker', isOpen && 'motiv-picker--open', className)}>
      <span id={`${id}-label`} className="motiv-picker__label">
        {label}
      </span>
      <div ref={anchorRef} className="motiv-picker__anchor">
        <button
          type="button"
          role="combobox"
          aria-labelledby={`${id}-label`}
          aria-describedby={selected?.hint ? `${id}-hint` : undefined}
          aria-controls={`${id}-list`}
          aria-expanded={isOpen}
          aria-activedescendant={isOpen ? `${id}-option-${current}` : undefined}
          disabled={disabled}
          className="motiv-picker__trigger"
          {...trigger}
        >
          {selected?.code && <span className="motiv-picker__code">{selected.code}</span>}
          <span className={cx('motiv-picker__value', !selected && 'motiv-picker__value--empty')}>
            {selected ? selected.label : placeholder}
          </span>
          <svg className="motiv-picker__chevron" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
        <ul
          ref={listRef}
          id={`${id}-list`}
          role="listbox"
          popover="manual"
          hidden={!isOpen}
          aria-labelledby={`${id}-label`}
          inert={!isOpen}
          className="motiv-picker__list"
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
                'motiv-picker__option',
                isOpen && i === current && 'motiv-picker__option--active',
              )}
              style={{ '--_i': i } as CSSProperties}
              onClick={() => commit(i)}
            >
              {option.code && <span className="motiv-picker__code">{option.code}</span>}
              <span className="motiv-picker__option-label" data-listbox-label>
                {option.label}
              </span>
              <svg className="motiv-picker__check" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 12.5l4.5 4.5L19 7.5" />
              </svg>
            </li>
          ))}
        </ul>
      </div>
      {selected?.hint && (
        <p id={`${id}-hint`} className="motiv-picker__hint">
          {selected.hint}
        </p>
      )}
      {name && <input type="hidden" name={name} value={value} disabled={disabled} />}
    </div>
  );
}
