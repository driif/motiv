import type { LinkProps } from '../../drawn/Link';
import { cx } from '../../utils/cx';
import { Icon } from '../../utils/Icon';

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
      className={cx('motiv-underline-link', className)}
      rel={external ? cx(rel, 'noopener noreferrer') : rel}
      {...props}
      {...(external && { target: '_blank' })}
    >
      <span className="motiv-underline-link__label">{children}</span>
      {arrow && (
        <Icon className="motiv-underline-link__arrow">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </Icon>
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
