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
      className={cx('motiv-sketch-command-menu', className)}
      data-open={open}
      onKeyDown={onKeyDown}
      onBlur={onBlur}
    >
      <button
        ref={launcherRef}
        type="button"
        className="motiv-sketch-command-menu__launcher"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={onLauncherClick}
      >
        <svg className="motiv-sketch-command-menu__glass" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M10.5 4.2c3.6-.4 6.4 2.3 6.3 5.9-.1 3.4-2.9 6-6.2 5.8C7.2 15.7 4.6 13 4.8 9.7 5 6.8 7.4 4.5 10.5 4.2z" />
          <path d="M15.2 15.4c1.6 1.4 3.2 3 4.6 4.7" />
        </svg>
        <span className="motiv-sketch-command-menu__placeholder">{placeholder}</span>
        {hotkey && <kbd className="motiv-sketch-command-menu__kbd">{hotkeyHint}</kbd>}
      </button>
      <div
        ref={menuRef}
        id={menuId}
        role="menu"
        aria-label={menuLabel}
        className="motiv-sketch-command-menu__menu"
      >
        {commands.map((command) => (
          <button
            key={command.id}
            type="button"
            role="menuitem"
            tabIndex={-1}
            className="motiv-sketch-command-menu__item"
            onClick={() => {
              close();
              command.onSelect();
            }}
          >
            <svg
              className="motiv-sketch-command-menu__arrow"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                pathLength={1}
                d="M3 13c3-1.5 7-2 12-1.2M12 7.5c2 1.6 3.8 3 5.5 4.6-1.9 1.3-3.6 2.9-5 4.6"
              />
            </svg>
            <span className="motiv-sketch-command-menu__label">{command.label}</span>
            {command.shortcut && (
              <kbd className="motiv-sketch-command-menu__kbd">{command.shortcut}</kbd>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
