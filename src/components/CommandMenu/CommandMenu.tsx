import {
  type ComponentProps,
  type CSSProperties,
  type FocusEvent,
  type KeyboardEvent,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';
import { cx } from '../../utils/cx';
import { Icon } from '../../utils/Icon';

export interface CommandMenuItem {
  id: string;
  label: string;
  shortcut?: string;
  onSelect: () => void;
}

export interface CommandMenuProps extends ComponentProps<'div'> {
  commands: CommandMenuItem[];
  placeholder?: string;
  /** Open with ⌘K / Ctrl+K from anywhere on the page. */
  hotkey?: boolean;
  menuLabel?: string;
}

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
  const [open, setOpen] = useState(false);
  const [hotkeyHint, setHotkeyHint] = useState('Ctrl K');
  const launcherRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  const items = () =>
    Array.from(menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? []);
  const focusItem = (i: number) => {
    const all = items();
    all[(i + all.length) % all.length]?.focus();
  };
  const openMenu = (focusFirst: boolean) => {
    setOpen(true);
    if (focusFirst) requestAnimationFrame(() => focusItem(0));
  };
  const close = () => {
    setOpen(false);
    launcherRef.current?.focus();
  };

  useEffect(() => {
    if (/Mac|iPhone|iPad/.test(navigator.userAgent)) setHotkeyHint('⌘K');
  }, []);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!launcherRef.current?.parentElement?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open]);

  useEffect(() => {
    if (!hotkey) return;
    const onKey = (event: globalThis.KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen(true);
        requestAnimationFrame(() =>
          menuRef.current?.querySelector<HTMLElement>('[role="menuitem"]')?.focus(),
        );
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [hotkey]);

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    onKeyDownProp?.(event);
    if (event.defaultPrevented) return;
    const current = items().indexOf(document.activeElement as HTMLElement);
    switch (event.key) {
      case 'Escape':
        if (!open) return;
        close();
        break;
      case 'ArrowDown':
        if (open) focusItem(current + 1);
        else openMenu(true);
        break;
      case 'ArrowUp':
        if (!open) return;
        focusItem(current - 1);
        break;
      case 'Home':
        if (!open) return;
        focusItem(0);
        break;
      case 'End':
        if (!open) return;
        focusItem(-1);
        break;
      default:
        return;
    }
    event.preventDefault();
  }

  function onBlur(event: FocusEvent<HTMLDivElement>) {
    onBlurProp?.(event);
    if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
  }

  return (
    <div
      {...props}
      className={cx('motiv-command-menu', className)}
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
        // detail 0: Enter/Space, not a pointer, so keyboard opens move focus into the menu.
        onClick={(event) => (open ? setOpen(false) : openMenu(event.detail === 0))}
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
            onClick={() => {
              close();
              command.onSelect();
            }}
          >
            <Icon>
              <path d="M5 12h14M13 6l6 6-6 6" />
            </Icon>
            <span className="motiv-command-menu__label">{command.label}</span>
            {command.shortcut && <kbd className="motiv-command-menu__kbd">{command.shortcut}</kbd>}
          </button>
        ))}
      </div>
    </div>
  );
}
