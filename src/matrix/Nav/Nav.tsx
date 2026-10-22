import type { NavProps } from '../../components/GlideNav';
import { cx } from '../../utils/cx';
import { ChevronNav } from '../ChevronNav';

export function Nav({ items, onChange, className, ...props }: NavProps) {
  return (
    <ChevronNav
      {...props}
      className={cx('motiv-matrix-nav', className)}
      sections={[
        {
          items: items.map(({ id, label, icon, count }) => ({
            id,
            icon,
            label: (
              <>
                <span className="motiv-matrix-nav__text">{label}</span>
                {count != null && (
                  <span className="motiv-matrix-nav__count">
                    <span className="motiv-visually-hidden">, </span>
                    {count}
                  </span>
                )}
              </>
            ),
          })),
        },
      ]}
      onChange={(id) => onChange(id)}
    />
  );
}
