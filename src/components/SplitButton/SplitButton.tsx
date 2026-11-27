import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import type { ComponentType } from 'react';
import { cx } from '../../utils/cx';
import { Icon } from '../../utils/Icon';
import {
  type ActionMenuClassNames,
  type ActionMenuItem,
  ActionMenuItems,
  actionMenuClassNames,
} from '../ActionMenu/ActionMenu';
import { Button, type ButtonProps } from '../Button/Button';

export interface SplitButtonProps extends ButtonProps {
  /** The alternatives in the menu behind the chevron. */
  items: ActionMenuItem[];
  /** Accessible name of the chevron button. */
  menuLabel?: string;
}

/** Literal class names per style, so bundlers and the tree-shake check can see them. */
export type SplitButtonClassNames = Record<'root' | 'main' | 'toggle', string>;

const splitButtonClassNames: SplitButtonClassNames = {
  root: 'motiv-split-button',
  main: 'motiv-split-button__main',
  toggle: 'motiv-split-button__toggle',
};

export function SplitButton(props: SplitButtonProps) {
  return (
    <SplitButtonBase
      {...props}
      Button={Button}
      classNames={splitButtonClassNames}
      menuClassNames={actionMenuClassNames}
    />
  );
}

// Internal: SplitButton over a style's Button and class names.
export function SplitButtonBase({
  Button,
  classNames,
  menuClassNames,
  items,
  menuLabel = 'More options',
  variant,
  size,
  disabled,
  className,
  style,
  ...props
}: SplitButtonProps & {
  Button: ComponentType<ButtonProps>;
  classNames: SplitButtonClassNames;
  menuClassNames: ActionMenuClassNames;
}) {
  const menuDisabled = disabled || items.length === 0;
  return (
    <div className={cx(classNames.root, className)} style={style}>
      <Button
        {...props}
        variant={variant}
        size={size}
        disabled={disabled}
        className={classNames.main}
      />
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild disabled={menuDisabled}>
          <Button
            variant={variant}
            size={size}
            disabled={menuDisabled}
            aria-label={menuLabel}
            className={classNames.toggle}
          >
            <Icon>
              <path d="M6 9l6 6 6-6" />
            </Icon>
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content className={menuClassNames.content} align="end" sideOffset={6}>
          <ActionMenuItems items={items} classNames={menuClassNames} />
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  );
}
