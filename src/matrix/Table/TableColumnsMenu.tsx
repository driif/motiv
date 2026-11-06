import type { TableColumnsMenuProps } from '../../components/Table';
import { cx } from '../../utils/cx';
import { useColumnsMenu } from '../../utils/useColumnsMenu';
import { Button } from '../Button';
import { Checkbox } from '../Checkbox';

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
    <div {...props} className={cx('motiv-matrix-table-menu', className)}>
      <Button {...triggerProps} variant="outline">
        {label}
      </Button>
      <fieldset {...panelProps} aria-label={label} className="motiv-matrix-table-menu__panel">
        {columns.map((column) => (
          <Checkbox key={column.id} label={column.label} {...checkboxProps(column.id)} />
        ))}
      </fieldset>
    </div>
  );
}
