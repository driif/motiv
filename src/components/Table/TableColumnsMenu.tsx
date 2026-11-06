import type { ComponentProps } from 'react';
import { cx } from '../../utils/cx';
import { useColumnsMenu } from '../../utils/useColumnsMenu';
import { Button } from '../Button';
import { SpringCheckbox } from '../SpringCheckbox';

export type TableColumnsMenuProps = Omit<ComponentProps<'div'>, 'children'> & {
  columns: { id: string; label: string }[];
  hiddenColumns: string[];
  onHiddenColumnsChange: (hiddenColumns: string[]) => void;
  label?: string;
};

export function TableColumnsMenu({
  columns,
  hiddenColumns,
  onHiddenColumnsChange,
  label = 'Columns',
  className,
  ...props
}: TableColumnsMenuProps) {
  const { triggerProps, panelProps, checkboxProps } = useColumnsMenu({
    columns,
    hiddenColumns,
    onHiddenColumnsChange,
  });

  return (
    <div {...props} className={cx('motiv-table-menu', className)}>
      <Button {...triggerProps} variant="outline">
        {label}
      </Button>
      <fieldset {...panelProps} aria-label={label} className="motiv-table-menu__panel">
        {columns.map((column) => (
          <SpringCheckbox key={column.id} label={column.label} {...checkboxProps(column.id)} />
        ))}
      </fieldset>
    </div>
  );
}
