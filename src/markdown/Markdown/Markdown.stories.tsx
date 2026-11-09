import type { Meta, StoryObj } from '@storybook/react-vite';
import type { CSSProperties } from 'react';
import { ThemePair } from '../../../.storybook/ThemePair';
import { Markdown } from './Markdown';

const meta = {
  title: 'Markdown/Markdown',
  component: Markdown,
  args: {
    children:
      '# Notes\n\nA **clear update**, with *emphasis* and [a link](/guide).\n\n- First item\n- Second item\n\n> Keep it simple.\n\n```js\nconst ready = true;\n```',
  },
} satisfies Meta<typeof Markdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Empty: Story = { args: { children: '' } };
export const RawHtml: Story = {
  args: { children: '<script>alert(1)</script>\n\n[x](javascript:alert(1))' },
};
export const LongContent: Story = {
  args: {
    children: `A long link: [${'long-content-'.repeat(12)}](/guide)\n\n\`\`\`text\n${'long code line '.repeat(20)}\n\`\`\``,
  },
  render: (args) => (
    <div style={{ maxWidth: '20rem' }}>
      <Markdown {...args} />
    </div>
  ),
};
export const Themes: Story = {
  render: (args) => <ThemePair>{() => <Markdown {...args} />}</ThemePair>,
};
export const Rethemed: Story = {
  render: (args) => (
    <div
      data-theme="light"
      style={{ '--motiv-color-primary': '#2563eb', '--motiv-radius': '0' } as CSSProperties}
    >
      <Markdown {...args} />
    </div>
  ),
};
