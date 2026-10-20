import type { ComponentProps, ReactNode } from 'react';
import type { MotivOption } from '../../types';
import { cx } from '../../utils/cx';
import { Icon } from '../../utils/Icon';

export interface FilterChipsProps extends Omit<ComponentProps<'div'>, 'onChange'> {
  options: MotivOption[];
  value: string[];
  onChange: (value: string[]) => void;
  label: string;
  showSummary?: boolean;
  summary?: (count: number, total: number) => ReactNode;
  clearLabel?: string;
}

const defaultSummary = (count: number, total: number) =>
  count ? `${count} of ${total} selected` : 'None selected';

export function FilterChips({
  options,
  value,
  onChange,
  label,
  showSummary = true,
  summary = defaultSummary,
  clearLabel = 'Clear',
  className,
  ...props
}: FilterChipsProps) {
  const count = options.filter((option) => value.includes(option.value)).length;

  return (
    <div {...props} className={cx('motiv-filter-chips', className)}>
      <div role="group" aria-label={label} className="motiv-filter-chips__list">
        {options.map((option) => {
          const on = value.includes(option.value);
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={on}
              className="motiv-filter-chips__chip"
              onClick={() =>
                onChange(on ? value.filter((v) => v !== option.value) : [...value, option.value])
              }
            >
              <Icon className="motiv-filter-chips__check">
                <path d="M5 12.5l4.5 4.5L19 7.5" />
              </Icon>
              <span className="motiv-filter-chips__label">{option.label}</span>
            </button>
          );
        })}
      </div>
      {showSummary && (
        <div className="motiv-filter-chips__summary">
          <span aria-live="polite">{summary(count, options.length)}</span>
          <button
            type="button"
            className="motiv-filter-chips__clear"
            disabled={!count}
            onClick={() => onChange([])}
          >
            {clearLabel}
          </button>
        </div>
      )}
    </div>
  );
}
