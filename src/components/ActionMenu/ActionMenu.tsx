import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { type ReactNode, useId } from 'react';
import { Icon } from '../../utils/Icon';
import { Button, type ButtonProps } from '../Button/Button';

export interface ActionMenuItem {
  label: string;
  onSelect: () => void;
  disabled?: boolean;
  /** Shown before the label. */
  icon?: ReactNode;
  /** Why the item is disabled; shown under the label while `disabled` is set. */
  disabledReason?: string;
}

// Internal: the menu rows, shared by ActionMenu and SplitButton.
export function ActionMenuItems({ items }: { items: ActionMenuItem[] }) {
  const id = useId();
  return items.map((item, index) => {
    const reason = item.disabled && item.disabledReason;
    return (
      <DropdownMenu.Item
        key={index}
        className="motiv-action-menu__item"
        disabled={item.disabled}
        textValue={item.label}
        aria-describedby={reason ? `${id}-${index}` : undefined}
        onSelect={item.onSelect}
      >
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
      </DropdownMenu.Item>
    );
  });
}

export interface ActionMenuProps extends Omit<ButtonProps, 'children'> {
  label?: string;
  items?: ActionMenuItem[];
}

export function ActionMenu({
  label = 'Actions',
  items = [],
  disabled,
  loading,
  id,
  ...buttonProps
}: ActionMenuProps) {
  const fallbackId = useId();
  const triggerId = id ?? fallbackId;
  const inert = disabled || loading || items.length === 0;
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild disabled={inert}>
        <Button
          {...buttonProps}
          id={triggerId}
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
      </DropdownMenu.Trigger>
      <DropdownMenu.Content
        className="motiv-action-menu__content"
        aria-labelledby={triggerId}
        align="start"
        sideOffset={6}
      >
        <ActionMenuItems items={items} />
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
