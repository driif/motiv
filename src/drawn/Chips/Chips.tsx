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
  const { selected, count, toggle, clear, summarize } = useChips({
    options,
    value,
    onChange,
    summary,
  });

  return (
    <div {...props} className={cx('motiv-sketch-chips', className)}>
      <div role="group" aria-label={label} className="motiv-sketch-chips__list">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            aria-pressed={selected.has(option.value)}
            className="motiv-sketch-chips__chip"
            onClick={() => toggle(option.value)}
          >
            <svg className="motiv-sketch-chips__check" viewBox="0 0 24 24" aria-hidden="true">
              <path pathLength={1} d="M4 13c2 1.5 3.5 3 5 5 3-5 6.5-9 11-12" />
            </svg>
            {option.label}
          </button>
        ))}
      </div>
      {showSummary && (
        <div className="motiv-sketch-chips__summary">
          <span aria-live="polite">{summarize()}</span>
          <button
            type="button"
            className="motiv-sketch-chips__clear"
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
