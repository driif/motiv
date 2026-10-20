import { useSyncExternalStore } from 'react';

// The library's toggles only report clicks; the app owns <html data-theme>.
// Every toggle on the page reads the attribute, so they all stay in step.
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributeFilter: ['data-theme'] });
  return () => observer.disconnect();
}

export function useTheme() {
  const dark = useSyncExternalStore(
    subscribe,
    () => document.documentElement.dataset.theme === 'dark',
    () => false,
  );
  const toggle = () => {
    const theme = dark ? 'light' : 'dark';
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('motiv-site-theme', theme);
  };
  return { dark, toggle };
}
