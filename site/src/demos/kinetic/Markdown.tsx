import { Markdown } from '@driif/motiv/markdown';

export function MarkdownDemo() {
  return (
    <Markdown>{`## Release notes

Write **clear updates** with *CommonMark* and [relative links](/kinetic/markdown-editor/).

- Headings and lists
- Inline \`code\` and fenced code blocks

> Keep the details close to the work.

\`\`\`js
const message = 'Ready to share';
\`\`\`

Raw HTML stays text: <strong>not markup</strong>.`}</Markdown>
  );
}
