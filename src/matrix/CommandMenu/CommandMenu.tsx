import type { CommandMenuProps } from '../../components/CommandMenu';
import { cx } from '../../utils/cx';
import { useCommandMenu } from '../../utils/useCommandMenu';

export function CommandMenu({
  commands,
  placeholder = 'Search or jump to…',
  hotkey = false,
  menuLabel = 'Commands',
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
    close,
    onKeyDown,
    onBlur,
    onLauncherClick,
  } = useCommandMenu({ hotkey, onKeyDown: onKeyDownProp, onBlur: onBlurProp });

  return (
    <div
      {...props}
      className={cx('motiv-matrix-command-menu', className)}
      data-open={open}
      onKeyDown={onKeyDown}
      onBlur={onBlur}
    >
      <button
        ref={launcherRef}
        type="button"
        className="motiv-matrix-command-menu__launcher"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={onLauncherClick}
      >
        <span className="motiv-matrix-command-menu__prompt" aria-hidden="true">
          &gt;
        </span>
        <span className="motiv-matrix-command-menu__placeholder">{placeholder}</span>
        <span className="motiv-matrix-command-menu__caret" aria-hidden="true" />
        {hotkey && <kbd className="motiv-matrix-command-menu__kbd">{hotkeyHint}</kbd>}
      </button>
      <div
        ref={menuRef}
        id={menuId}
        role="menu"
        aria-label={menuLabel}
        className="motiv-matrix-command-menu__menu"
      >
        {commands.map((command) => (
          <button
            key={command.id}
            type="button"
            role="menuitem"
            tabIndex={-1}
            className="motiv-matrix-command-menu__item"
            onClick={() => {
              close();
              command.onSelect();
            }}
          >
            <span className="motiv-matrix-command-menu__label">{command.label}</span>
            {command.shortcut && (
              <kbd className="motiv-matrix-command-menu__kbd">{command.shortcut}</kbd>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
