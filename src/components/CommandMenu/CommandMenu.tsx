import type { ComponentProps, CSSProperties } from 'react';
import { cx } from '../../utils/cx';
import { Icon } from '../../utils/Icon';
import { useCommandMenu } from '../../utils/useCommandMenu';

export interface CommandMenuItem {
  id: string;
  label: string;
  shortcut?: string;
  onSelect: () => void;
  /** Shown and focusable, but not selectable. */
  disabled?: boolean;
  /** Muted text next to a disabled command, e.g. why it is unavailable. */
  disabledReason?: string;
}

export interface CommandMenuProps extends ComponentProps<'div'> {
  commands: CommandMenuItem[];
  placeholder?: string;
  /** Open with ⌘K / Ctrl+K from anywhere on the page. */
  hotkey?: boolean;
  menuLabel?: string;
  /**
   * Controlled open state; pair with `onOpenChange`. Every controlled opening focuses the first
   * command; uncontrolled pointer opens leave focus on the launcher.
   */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** `sm` makes the launcher control-height, for toolbars and dense layouts. */
  size?: 'sm' | 'md';
}

export function CommandMenu({
  commands,
  placeholder = 'Search or jump to…',
  hotkey = false,
  menuLabel = 'Commands',
  open: openProp,
  onOpenChange,
  size = 'md',
  className,
  onKeyDown: onKeyDownProp,
  onBlur: onBlurProp,
  ...props
}: CommandMenuProps) {
  const {
    open,
    hotkeyHint,
    launcherRef,
    menuRef,
    menuId,
    select,
    onKeyDown,
    onBlur,
    onLauncherClick,
  } = useCommandMenu({
    hotkey,
    open: openProp,
    onOpenChange,
    onKeyDown: onKeyDownProp,
    onBlur: onBlurProp,
  });

  return (
    <div
      {...props}
      className={cx('motiv-command-menu', size === 'sm' && 'motiv-command-menu--sm', className)}
      data-open={open}
      onKeyDown={onKeyDown}
      onBlur={onBlur}
    >
      <button
        ref={launcherRef}
        type="button"
        className="motiv-command-menu__launcher"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={onLauncherClick}
      >
        <Icon>
          <circle cx="11" cy="11" r="6.5" />
          <path d="M16 16l4.5 4.5" />
        </Icon>
        <span className="motiv-command-menu__placeholder">{placeholder}</span>
        {hotkey && <kbd className="motiv-command-menu__kbd">{hotkeyHint}</kbd>}
      </button>
      <div
        ref={menuRef}
        id={menuId}
        role="menu"
        aria-label={menuLabel}
        className="motiv-command-menu__menu"
      >
        {commands.map((command, i) => (
          <button
            key={command.id}
            type="button"
            role="menuitem"
            tabIndex={-1}
            className="motiv-command-menu__item"
            style={{ '--_i': i } as CSSProperties}
            aria-disabled={command.disabled || undefined}
            aria-describedby={
              command.disabled && command.disabledReason ? `${menuId}-${i}` : undefined
            }
            onClick={() => select(command)}
          >
            <Icon>
              <path d="M5 12h14M13 6l6 6-6 6" />
            </Icon>
            <span className="motiv-command-menu__label">{command.label}</span>
            {command.disabled && command.disabledReason && (
              <span id={`${menuId}-${i}`} className="motiv-command-menu__reason">
                {command.disabledReason}
              </span>
            )}
            {command.shortcut && <kbd className="motiv-command-menu__kbd">{command.shortcut}</kbd>}
          </button>
        ))}
      </div>
    </div>
  );
}
