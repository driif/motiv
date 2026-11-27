import { useEffect, useLayoutEffect, useRef } from 'react';

// CSS caps the height at maxRows; above that the content scrolls.
export function fitHeight(textarea: HTMLTextAreaElement) {
  // A hidden textarea (closed dialog, inactive tab) has no layout to measure.
  if (!textarea.scrollHeight) return;
  textarea.style.height = 'auto';
  textarea.style.height = `${textarea.scrollHeight + textarea.offsetHeight - textarea.clientHeight}px`;
}

/** Fits the textarea inside the returned ref's element on every render and when it is shown. */
export function useFitHeight() {
  const control = useRef<HTMLDivElement>(null);

  // Each render: a controlled value can change without an input event, e.g. cleared after send.
  useLayoutEffect(() => {
    const textarea = control.current?.querySelector('textarea');
    if (textarea) fitHeight(textarea);
  });

  useEffect(() => {
    const textarea = control.current?.querySelector('textarea');
    if (!textarea || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) fitHeight(textarea);
    });
    observer.observe(textarea);
    return () => observer.disconnect();
  }, []);

  return control;
}
