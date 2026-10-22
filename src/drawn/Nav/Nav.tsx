import type { NavProps } from '../../components/GlideNav';
import { cx } from '../../utils/cx';
import { NavItem } from '../NavItem';

export function Nav({ items, value, onChange, label, className, ...props }: NavProps) {
  return (
    <nav {...props} aria-label={label} className={cx('motiv-nav', className)}>
      <ul className="motiv-nav__list">
        {items.map((item) => (
          <li key={item.id}>
            <NavItem
              icon={item.icon}
              label={
                <>
                  <span className="motiv-nav__text">{item.label}</span>
                  {item.count != null && (
                    <span className="motiv-nav__count">
                      <span className="motiv-visually-hidden">, </span>
                      {item.count}
                    </span>
                  )}
                </>
              }
              active={item.id === value}
              onClick={() => onChange(item.id)}
            />
          </li>
        ))}
      </ul>
    </nav>
  );
}
