import { type ComponentProps, type ReactNode, useId } from 'react';
import { cx } from '../../utils/cx';
import { useTooltip } from '../../utils/useTooltip';

export interface TooltipProps extends Omit<ComponentProps<'span'>, 'content'> {
  content: ReactNode;
  label?: string;
}

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
      className={cx('motiv-tooltip', className)}
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
        className="motiv-tooltip__trigger"
        aria-label={label}
        aria-describedby={id}
        {...trigger}
      >
        i
      </button>
      <span role="tooltip" id={id} className="motiv-tooltip__note">
        {content}
      </span>
    </span>
  );
}
