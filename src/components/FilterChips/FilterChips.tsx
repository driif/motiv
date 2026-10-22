import type { ComponentProps, ReactNode } from 'react';
import type { MotivOption } from '../../types';
import { cx } from '../../utils/cx';
import { Icon } from '../../utils/Icon';
import { useChips } from '../../utils/useChips';

export interface FilterChipsProps extends Omit<ComponentProps<'div'>, 'onChange'> {
  options: MotivOption[];
  value: string[];
  onChange: (value: string[]) => void;
  label: string;
  showSummary?: boolean;
  summary?: (count: number, total: number) => ReactNode;
  clearLabel?: string;
}

export function FilterChips({
  options,
  value,
  onChange,
  label,
  showSummary = true,
  summary,
  clearLabel = 'Clear',
  className,
  ...props
}: FilterChipsProps) {
  const { selected, count, toggle, clear, summarize } = useChips({
    options,
    value,
    onChange,
    summary,
  });

  return (
    <div {...props} className={cx('motiv-filter-chips', className)}>
      <div role="group" aria-label={label} className="motiv-filter-chips__list">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            aria-pressed={selected.has(option.value)}
            className="motiv-filter-chips__chip"
            onClick={() => toggle(option.value)}
          >
            <Icon className="motiv-filter-chips__check">
              <path d="M5 12.5l4.5 4.5L19 7.5" />
            </Icon>
            <span className="motiv-filter-chips__label">{option.label}</span>
          </button>
        ))}
      </div>
      {showSummary && (
        <div className="motiv-filter-chips__summary">
          <span aria-live="polite">{summarize()}</span>
          <button
            type="button"
            className="motiv-filter-chips__clear"
            disabled={!count}
            onClick={clear}
          >
            {clearLabel}
          </button>
        </div>
      )}
    </div>
  );
}
