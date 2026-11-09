import type { Meta, StoryObj } from '@storybook/react-vite';
import { type CSSProperties, useState } from 'react';
import { ThemePair } from '../../../.storybook/ThemePair';
import { Button } from '../../components/Button';
import { MarkdownEditor } from './MarkdownEditor';

const meta = {
  title: 'Markdown/MarkdownEditor',
  component: MarkdownEditor,
  args: {
    defaultValue: '## Draft\n\nWrite **Markdown** here.\n\n- First item\n- Second item',
    rows: 6,
  },
} satisfies Meta<typeof MarkdownEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Empty: Story = { args: { defaultValue: '' } };
export const Disabled: Story = { args: { disabled: true } };
export const ReadOnly: Story = { args: { readOnly: true } };
export const Controlled: Story = {
  render: function ControlledEditor(args) {
    const [value, setValue] = useState(args.defaultValue ?? '');
    return (
      <MarkdownEditor
        {...args}
        defaultValue={undefined}
        value={value}
        onChange={(event) => setValue(event.currentTarget.value)}
      />
    );
  },
};
export const FormReset: Story = {
  render: (args) => (
    <form style={{ display: 'grid', gap: '1rem' }}>
      <MarkdownEditor {...args} />
      <Button type="reset" variant="outline">
        Reset
      </Button>
    </form>
  ),
};
export const LongContent: Story = {
  args: {
    label: 'Detailed release notes for the next version',
    previewLabel: 'Preview of the release notes',
    defaultValue: `# Long content\n\n${'unbroken-content'.repeat(15)}\n\n\`\`\`text\n${'long line '.repeat(30)}\n\`\`\``,
  },
  render: (args) => (
    <div style={{ maxWidth: '20rem' }}>
      <MarkdownEditor {...args} />
    </div>
  ),
};
export const Themes: Story = {
  render: (args) => <ThemePair>{() => <MarkdownEditor {...args} />}</ThemePair>,
};
export const Rethemed: Story = {
  render: (args) => (
    <div
      data-theme="light"
      style={{ '--motiv-color-primary': '#2563eb', '--motiv-radius': '0' } as CSSProperties}
    >
      <MarkdownEditor {...args} />
    </div>
  ),
};
