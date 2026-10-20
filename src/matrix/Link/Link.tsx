import type { LinkProps } from '../../drawn/Link';
import { cx } from '../../utils/cx';

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
      className={cx('motiv-matrix-link', className)}
      rel={external ? cx(rel, 'noopener noreferrer') : rel}
      {...props}
      {...(external && { target: '_blank' })}
    >
      <span className="motiv-matrix-link__label">{children}</span>
      {arrow && (
        <svg className="motiv-matrix-link__arrow" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 12h14M13 6l6 6-6 6" />
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
