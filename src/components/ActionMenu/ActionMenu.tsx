import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useId } from 'react';
import { Icon } from '../../utils/Icon';
import { Button, type ButtonProps } from '../Button/Button';

export interface ActionMenuItem {
  label: string;
  onSelect: () => void;
  disabled?: boolean;
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
        {items.map((item, index) => (
          <DropdownMenu.Item
            key={index}
            className="motiv-action-menu__item"
            disabled={item.disabled}
            onSelect={item.onSelect}
          >
            {item.label}
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
