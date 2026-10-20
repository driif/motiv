import type { ComponentProps, ReactNode } from 'react';
import { cx } from '../../utils/cx';

interface NavItemOwnProps {
  icon: ReactNode;
  label: string;
  active?: boolean;
  hasSubmenu?: boolean;
}

export type NavItemProps = NavItemOwnProps &
  (
    | (Omit<ComponentProps<'a'>, 'children'> & { href: string })
    | (Omit<ComponentProps<'button'>, 'children'> & { href?: undefined })
  );

export function NavItem({
  icon,
  label,
  active = false,
  hasSubmenu = false,
  ...rest
}: NavItemProps) {
  const content = (
    <>
      <span className="motiv-nav-item__icon" aria-hidden="true">
        <svg className="motiv-nav-item__ring" viewBox="0 0 44 44" aria-hidden="true">
          <path
            pathLength={1}
            d="M23 3C35 3 41 12 41 22C41 33 33 41 22 41C11 41 3 33 3 22C3 12 11 4 26 4"
          />
        </svg>
        {icon}
      </span>
      <span className="motiv-nav-item__label">{label}</span>
      {hasSubmenu && (
        <svg className="motiv-nav-item__chevron" viewBox="0 0 16 16" aria-hidden="true">
          <path d="M6 3l5 5-5 5" />
        </svg>
      )}
    </>
  );
  const current = active && { 'aria-current': 'page' as const };

  if (rest.href !== undefined) {
    const { className, ...props } = rest;
    return (
      <a {...props} {...current} className={cx('motiv-nav-item', className)}>
        {content}
      </a>
    );
  }
  const { className, ...props } = rest;
  return (
    <button type="button" {...props} {...current} className={cx('motiv-nav-item', className)}>
      {content}
    </button>
  );
}
