import {
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';

/** Launcher + menu state: open/close, ⌘K hotkey, outside-click close and roving item focus. */
export function useCommandMenu({
  hotkey,
  onKeyDown: onKeyDownProp,
  onBlur: onBlurProp,
}: {
  hotkey: boolean;
  onKeyDown?: (event: KeyboardEvent<HTMLDivElement>) => void;
  onBlur?: (event: FocusEvent<HTMLDivElement>) => void;
}) {
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

  return {
    open,
    hotkeyHint,
    launcherRef,
    menuRef,
    menuId,
    close,
    onKeyDown,
    onBlur,
    // detail 0: Enter/Space, not a pointer, so keyboard opens move focus into the menu.
    onLauncherClick: (event: MouseEvent<HTMLButtonElement>) =>
      open ? setOpen(false) : openMenu(event.detail === 0),
  };
}
