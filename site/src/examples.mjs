import { pages } from './catalog.mjs';

// Example apps, the same three in every style: site/src/examples/<style>/<title>.tsx, shown by
// /<style>/examples/<id>/ through /preview/<style>/examples/<id>/. components: the category pages
// every style's version must use (checked by scripts/check-site.mjs); a page lists all it imports.
export const examples = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    blurb:
      'An admin dashboard: navigation, command menu, notifications, stat cards and a filterable table that toasts on actions.',
    components: [
      'Nav',
      'ThemeToggle',
      'NotificationList',
      'CommandMenu',
      'Card',
      'Badge',
      'Progress',
      'Chips',
      'Table',
      'Toast',
    ],
  },
  {
    id: 'settings',
    title: 'Settings',
    blurb:
      'An account settings screen: sections in tabs, every form control, a split save button and a confirmed delete.',
    components: [
      'TextField',
      'Textarea',
      'Select',
      'MultiSelect',
      'Checkbox',
      'Radio',
      'Switch',
      'Slider',
      'DatePicker',
      'OtpInput',
      'FileUpload',
      'Accordion',
      'Confirm',
      'SplitButton',
      'Tooltip',
    ],
  },
  {
    id: 'inbox',
    title: 'Inbox',
    blurb:
      'A mail client: a resizable message list and reading pane, per-message actions, a Markdown compose dialog and undo toasts.',
    components: ['Splitter', 'ActionMenu', 'Dialog', 'MarkdownEditor', 'Markdown', 'Link', 'Toast'],
  },
];

/** The style's component pages whose symbols an example's source imports from @driif/motiv. */
export function usedPages(style, source) {
  const imported = [...source.matchAll(/import\s*\{([^}]*)\}\s*from\s*'@driif\/motiv[^']*'/g)]
    .flatMap((match) => match[1].split(','))
    .map(
      (name) =>
        name
          .trim()
          .replace(/^type\s+/, '')
          .split(/\s+as\s+/)[0],
    );
  return pages(style).filter((page) =>
    page.sections.some((section) => section.symbols.some((name) => imported.includes(name))),
  );
}
