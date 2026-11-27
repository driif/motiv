import type { Meta, StoryObj } from '@storybook/react-vite';
import { ThemePair } from '../../../../.storybook/ThemePair';
import { withDrawn } from '../../../../.storybook/withDrawn';
import { Markdown } from '../../../markdown/Markdown';

const meta = {
  title: 'Drawn/Markdown',
  component: Markdown,
  decorators: [withDrawn],
  args: {
    children:
      '# Notes\n\nA **clear update**, with *emphasis*, `inline code` and [a link](/guide).\n\n## Steps\n\n- First item\n- Second item\n\n> Keep it simple.\n\n```js\nconst ready = true;\n```\n\n---\n\n### Done',
  },
} satisfies Meta<typeof Markdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Empty: Story = { args: { children: '' } };
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
