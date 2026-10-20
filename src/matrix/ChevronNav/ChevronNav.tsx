import type { ComponentProps, MouseEvent, ReactNode } from 'react';
import { cx } from '../../utils/cx';

export interface ChevronNavItem {
  id: string;
  label: ReactNode;
  icon?: ReactNode;
  expandable?: boolean;
  href?: string;
}

export interface ChevronNavSection {
  title?: ReactNode;
  items: ChevronNavItem[];
}

export interface ChevronNavProps extends Omit<ComponentProps<'nav'>, 'onChange'> {
  sections: ChevronNavSection[];
  value: string;
  onChange: (id: string, event: MouseEvent<HTMLElement>) => void;
  label: string;
}

export function ChevronNav({
  sections,
  value,
  onChange,
  label,
  className,
  ...props
}: ChevronNavProps) {
  return (
    <nav {...props} aria-label={label} className={cx('motiv-matrix-chevnav', className)}>
      {sections.map((section, s) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: sections have no id and never reorder.
        <div key={s} className="motiv-matrix-chevnav__section">
          {section.title && <div className="motiv-matrix-chevnav__title">{section.title}</div>}
          <ul className="motiv-matrix-chevnav__list">
            {section.items.map((item) => {
              const common = {
                className: cx(
                  'motiv-matrix-chevnav__item',
                  item.id === value && 'motiv-matrix-chevnav__item--active',
                ),
                'aria-current': item.id === value ? ('page' as const) : undefined,
                onClick: (event: MouseEvent<HTMLElement>) => onChange(item.id, event),
              };
              const content = (
                <>
                  <span className="motiv-matrix-chevnav__icon" aria-hidden="true">
                    {item.icon}
                  </span>
                  <span className="motiv-matrix-chevnav__label">{item.label}</span>
                  {item.expandable && (
                    <svg
                      className="motiv-matrix-chevnav__chevs"
                      viewBox="0 0 30 16"
                      aria-hidden="true"
                    >
                      <path d="M4 3l5 5-5 5" />
                      <path d="M13 3l5 5-5 5" />
                      <path d="M22 3l5 5-5 5" />
                    </svg>
                  )}
                </>
              );
              return (
                <li key={item.id}>
                  {item.href ? (
                    <a href={item.href} {...common}>
                      {content}
                    </a>
                  ) : (
                    <button type="button" {...common}>
                      {content}
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
