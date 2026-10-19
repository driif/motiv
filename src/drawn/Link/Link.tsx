import type { ComponentProps } from 'react';
import { cx } from '../../utils/cx';

export interface LinkProps extends ComponentProps<'a'> {
  arrow?: boolean;
  external?: boolean;
  externalLabel?: string;
}

export function Link({
  arrow = true,
  external = false,
  externalLabel = '(opens in a new tab)',
  className,
  rel,
  children,
  ...props
}: LinkProps) {
  return (
    <a
      className={cx('motiv-link', className)}
      rel={external ? cx(rel, 'noopener noreferrer') : rel}
      {...props}
      {...(external && { target: '_blank' })}
    >
      <span className="motiv-link__label">{children}</span>
      {arrow && (
        <svg
          className="motiv-link__arrow"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path pathLength={1} d="M4 13c4-1 9-1 15-1M14 7c2 2 3.5 3.5 5 5-1.5 1.5-3 3-5 5" />
        </svg>
      )}
      {external && (
        <>
          {' '}
          <span className="motiv-visually-hidden">{externalLabel}</span>
        </>
      )}
    </a>
  );
}
