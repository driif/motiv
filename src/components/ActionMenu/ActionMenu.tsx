import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { type ReactElement, type ReactNode, useId } from 'react';
import { Icon } from '../../utils/Icon';
import { Button, type ButtonProps } from '../Button/Button';

export type ActionMenuItem = {
  label: string;
  disabled?: boolean;
  /** Shown before the label. */
  icon?: ReactNode;
  /** Why the item is disabled; shown under the label while `disabled` is set. */
  disabledReason?: string;
} & (
  | { onSelect: () => void }
  | {
      /** Opens a nested menu with these items. */
      submenu: ActionMenuItem[];
    }
);

// Internal: the menu rows, shared by ActionMenu and SplitButton.
export function ActionMenuItems({ items }: { items: ActionMenuItem[] }) {
  const id = useId();
  return items.map((item, index) => {
    const reason = item.disabled && item.disabledReason;
    const rowProps = {
      className: 'motiv-action-menu__item',
      disabled: item.disabled,
      textValue: item.label,
      'aria-describedby': reason ? `${id}-${index}` : undefined,
    };
    const content = (
      <>
        {item.icon && (
          <span className="motiv-action-menu__icon" aria-hidden="true">
            {item.icon}
          </span>
        )}
        <span className="motiv-action-menu__text">
          <span>{item.label}</span>
          {reason && (
            // Hidden from the item name; aria-describedby still reads it.
            <span id={`${id}-${index}`} className="motiv-action-menu__reason" aria-hidden="true">
              {reason}
            </span>
          )}
        </span>
      </>
    );
    if ('onSelect' in item)
      return (
        <DropdownMenu.Item key={index} {...rowProps} onSelect={item.onSelect}>
          {content}
        </DropdownMenu.Item>
      );
    return (
      <DropdownMenu.Sub key={index}>
        <DropdownMenu.SubTrigger {...rowProps}>
          {content}
          <Icon className="motiv-action-menu__chevron">
            <path d="M9 6l6 6-6 6" />
          </Icon>
        </DropdownMenu.SubTrigger>
        <DropdownMenu.SubContent className="motiv-action-menu__content" sideOffset={6}>
          <ActionMenuItems items={item.submenu} />
        </DropdownMenu.SubContent>
      </DropdownMenu.Sub>
    );
  });
}

export interface ActionMenuProps extends Omit<ButtonProps, 'children'> {
  label?: string;
  items?: ActionMenuItem[];
  /** Replaces the button, for example with an IconButton. It then names the menu. */
  trigger?: ReactElement;
  /** Controls the menu, for example to open it from a context menu. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /**
   * Runs before the closed menu focuses its trigger; `event.preventDefault()` keeps focus away.
   * An item that moved focus, for example into a field, keeps that focus without it.
   */
  onCloseAutoFocus?: (event: Event) => void;
}

export function ActionMenu({
  label = 'Actions',
  items = [],
  trigger,
  open,
  onOpenChange,
  onCloseAutoFocus,
  disabled,
  loading,
  id,
  ...buttonProps
}: ActionMenuProps) {
  const fallbackId = useId();
  const triggerId = id ?? fallbackId;
  const inert = disabled || loading || items.length === 0;
  // Not modal: a modal menu traps focus, so a field that an item shows could not take it.
  return (
    <DropdownMenu.Root open={open} onOpenChange={onOpenChange} modal={false}>
      <DropdownMenu.Trigger asChild disabled={inert} id={triggerId}>
        {trigger ?? (
          <Button
            {...buttonProps}
            disabled={inert}
            loading={loading}
            iconRight={
              <Icon>
                <path d="M6 9l6 6 6-6" />
              </Icon>
            }
          >
            {label}
          </Button>
        )}
      </DropdownMenu.Trigger>
      <DropdownMenu.Content
        className="motiv-action-menu__content"
        aria-labelledby={triggerId}
        align="start"
        sideOffset={6}
        onCloseAutoFocus={(event) => {
          // Runs after the menu left the DOM, so focus off body was moved there by an item.
          const focused = document.activeElement;
          if (focused && focused !== document.body) event.preventDefault();
          else onCloseAutoFocus?.(event);
        }}
      >
        <ActionMenuItems items={items} />
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
