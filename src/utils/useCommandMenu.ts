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
  open: openProp,
  onOpenChange,
  onKeyDown: onKeyDownProp,
  onBlur: onBlurProp,
}: {
  hotkey: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onKeyDown?: (event: KeyboardEvent<HTMLDivElement>) => void;
  onBlur?: (event: FocusEvent<HTMLDivElement>) => void;
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = openProp ?? internalOpen;
  const [hotkeyHint, setHotkeyHint] = useState('Ctrl K');
  const launcherRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  // Starts closed so mounting with `open` focuses the first command.
  const committedOpen = useRef(false);
  // Uncontrolled only: false after a pointer open, so the menu opens without taking focus.
  const moveFocus = useRef(true);
  // Set by an outside pointerdown so the blur that follows it doesn't request a second close.
  const dismissing = useRef(false);
  // Set while a command runs, so focus it moves outside doesn't request a second close.
  const selecting = useRef(false);

  const items = () =>
    Array.from(menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? []);
  const focusItem = (i: number) => {
    const all = items();
    all[(i + all.length) % all.length]?.focus();
  };
  const requestOpen = (next: boolean, focus = true) => {
    if (next === open) return;
    if (openProp === undefined) {
      moveFocus.current = focus;
      setInternalOpen(next);
    }
    onOpenChange?.(next);
  };
  const onHotkey = useRef(() => {});
  onHotkey.current = () => (open ? focusItem(0) : requestOpen(true));

  useEffect(() => {
    const focus = moveFocus.current;
    moveFocus.current = true;
    if (committedOpen.current === open) return;
    committedOpen.current = open;
    if (open) {
      if (focus) focusItem(0);
    } else if (
      !dismissing.current &&
      launcherRef.current?.parentElement?.contains(document.activeElement)
    )
      launcherRef.current.focus();
  });

  useEffect(() => {
    if (/Mac|iPhone|iPad/.test(navigator.userAgent)) setHotkeyHint('⌘K');
  }, []);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      dismissing.current = !launcherRef.current?.parentElement?.contains(event.target as Node);
      if (dismissing.current) requestOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  });

  useEffect(() => {
    if (!hotkey) return;
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.defaultPrevented) return;
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        onHotkey.current();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [hotkey]);

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    dismissing.current = false;
    onKeyDownProp?.(event);
    if (event.defaultPrevented) return;
    const current = items().indexOf(document.activeElement as HTMLElement);
    switch (event.key) {
      case 'Escape':
        if (!open) return;
        requestOpen(false);
        break;
      case 'ArrowDown':
        if (open) focusItem(current + 1);
        else requestOpen(true);
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
    if (selecting.current || event.currentTarget.contains(event.relatedTarget)) return;
    if (dismissing.current) dismissing.current = false;
    else requestOpen(false);
  }

  return {
    open,
    hotkeyHint,
    launcherRef,
    menuRef,
    menuId,
    select: (command: { onSelect: () => void }) => {
      selecting.current = true;
      try {
        requestOpen(false);
        command.onSelect();
      } finally {
        selecting.current = false;
      }
    },
    onKeyDown,
    onBlur,
    // detail 0: Enter/Space, not a pointer, so keyboard opens move focus into the menu.
    onLauncherClick: (event: MouseEvent<HTMLButtonElement>) =>
      requestOpen(!open, open || event.detail === 0),
  };
}
