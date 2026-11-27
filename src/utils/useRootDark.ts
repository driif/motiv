import { useSyncExternalStore } from 'react';

const darkQuery = '(prefers-color-scheme: dark)';

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributeFilter: ['data-theme'] });
  const media = matchMedia(darkQuery);
  media.addEventListener('change', onChange);
  return () => {
    observer.disconnect();
    media.removeEventListener('change', onChange);
  };
}

function rootIsDark() {
  const theme = document.documentElement.dataset.theme;
  return theme ? theme === 'dark' : matchMedia(darkQuery).matches;
}

const subscribeNone = () => () => {};
const noSnapshot = () => undefined;

/** `dark` when given, else the root theme; undefined on the server and while hydrating. */
export function useRootDark(dark: boolean | undefined) {
  const follow = dark === undefined;
  const rootDark = useSyncExternalStore(
    follow ? subscribe : subscribeNone,
    follow ? rootIsDark : noSnapshot,
    noSnapshot,
  );
  return dark ?? rootDark;
}
