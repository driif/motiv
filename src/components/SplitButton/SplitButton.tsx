import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import type { ComponentType } from 'react';
import { cx } from '../../utils/cx';
import { Icon } from '../../utils/Icon';
import {
  type ActionMenuItem,
  ActionMenuItems,
  type ActionMenuPrefix,
} from '../ActionMenu/ActionMenu';
import { Button, type ButtonProps } from '../Button/Button';

export interface SplitButtonProps extends ButtonProps {
  /** The alternatives in the menu behind the chevron. */
  items: ActionMenuItem[];
  /** Accessible name of the chevron button. */
  menuLabel?: string;
}

export function SplitButton(props: SplitButtonProps) {
  return <SplitButtonBase {...props} Button={Button} prefix="motiv" />;
}

// Internal: SplitButton over a style's Button and class prefix.
export function SplitButtonBase({
  Button,
  prefix,
  items,
  menuLabel = 'More options',
  variant,
  size,
  disabled,
  className,
  style,
  ...props
}: SplitButtonProps & { Button: ComponentType<ButtonProps>; prefix: ActionMenuPrefix }) {
  const menuDisabled = disabled || items.length === 0;
  return (
    <div className={cx(`${prefix}-split-button`, className)} style={style}>
      <Button
        {...props}
        variant={variant}
        size={size}
        disabled={disabled}
        className={`${prefix}-split-button__main`}
      />
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild disabled={menuDisabled}>
          <Button
            variant={variant}
            size={size}
            disabled={menuDisabled}
            aria-label={menuLabel}
            className={`${prefix}-split-button__toggle`}
          >
            <Icon>
              <path d="M6 9l6 6 6-6" />
            </Icon>
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content
          className={`${prefix}-action-menu__content`}
          align="end"
          sideOffset={6}
        >
          <ActionMenuItems items={items} prefix={prefix} />
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  );
}
