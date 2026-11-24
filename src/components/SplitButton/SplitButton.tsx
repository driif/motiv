import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { cx } from '../../utils/cx';
import { Icon } from '../../utils/Icon';
import { type ActionMenuItem, ActionMenuItems } from '../ActionMenu/ActionMenu';
import { Button, type ButtonProps } from '../Button/Button';

export interface SplitButtonProps extends ButtonProps {
  /** The alternatives in the menu behind the chevron. */
  items: ActionMenuItem[];
  /** Accessible name of the chevron button. */
  menuLabel?: string;
}

export function SplitButton({
  items,
  menuLabel = 'More options',
  variant,
  size,
  disabled,
  className,
  style,
  ...props
}: SplitButtonProps) {
  const menuDisabled = disabled || items.length === 0;
  return (
    <div className={cx('motiv-split-button', className)} style={style}>
      <Button
        {...props}
        variant={variant}
        size={size}
        disabled={disabled}
        className="motiv-split-button__main"
      />
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild disabled={menuDisabled}>
          <Button
            variant={variant}
            size={size}
            disabled={menuDisabled}
            aria-label={menuLabel}
            className="motiv-split-button__toggle"
          >
            <Icon>
              <path d="M6 9l6 6 6-6" />
            </Icon>
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content className="motiv-action-menu__content" align="end" sideOffset={6}>
          <ActionMenuItems items={items} />
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  );
}
