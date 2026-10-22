import { useId } from 'react';
import type { TooltipProps } from '../../drawn/Tooltip';
import { cx } from '../../utils/cx';
import { useTooltip } from '../../utils/useTooltip';

export function Tooltip({
  content,
  label = 'More information',
  className,
  onPointerEnter,
  onPointerLeave,
  ...props
}: TooltipProps) {
  const id = useId();
  const { root, hover, trigger } = useTooltip();

  return (
    <span
      {...props}
      {...root}
      className={cx('motiv-matrix-tip', className)}
      onPointerEnter={(event) => {
        hover(true);
        onPointerEnter?.(event);
      }}
      onPointerLeave={(event) => {
        hover(false);
        onPointerLeave?.(event);
      }}
    >
      <button
        type="button"
        className="motiv-matrix-tip__trigger"
        aria-label={label}
        aria-describedby={id}
        {...trigger}
      >
        i
      </button>
      <span role="tooltip" id={id} className="motiv-matrix-tip__note">
        {content}
      </span>
    </span>
  );
}
