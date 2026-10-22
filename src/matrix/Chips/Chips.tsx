import type { FilterChipsProps } from '../../components/FilterChips';
import { cx } from '../../utils/cx';
import { useChips } from '../../utils/useChips';

export function Chips({
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
  const { count, toggle, clear, summarize } = useChips({ options, value, onChange, summary });

  return (
    <div {...props} className={cx('motiv-matrix-chips', className)}>
      <div role="group" aria-label={label} className="motiv-matrix-chips__list">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            aria-pressed={value.includes(option.value)}
            className="motiv-matrix-chips__chip"
            onClick={() => toggle(option.value)}
          >
            <span className="motiv-matrix-chips__box" aria-hidden="true" />
            {option.label}
          </button>
        ))}
      </div>
      {showSummary && (
        <div className="motiv-matrix-chips__summary">
          <span aria-live="polite">{summarize()}</span>
          <button
            type="button"
            className="motiv-matrix-chips__clear"
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
