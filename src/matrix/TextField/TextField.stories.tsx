import type { Meta, StoryObj } from '@storybook/react-vite';
import { ThemePair } from '../../../.storybook/ThemePair';
import { withMatrix } from '../../../.storybook/withMatrix';
import { TextField } from './TextField';

const meta = {
  title: 'Matrix/TextField',
  component: TextField,
  decorators: [withMatrix],
  args: { label: 'Your name' },
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithHint: Story = {
  args: { label: 'Email', type: 'email', hint: 'We only use it to reply.' },
};

export const Filled: Story = { args: { defaultValue: 'Ada Lovelace' } };

export const Disabled: Story = { args: { disabled: true, defaultValue: 'Read only' } };

export const LabelHidden: Story = {
  args: { labelPosition: 'hidden', defaultValue: 'Rename me' },
};

export const Color: Story = { args: { type: 'color', label: 'Accent', defaultValue: '#3b82f6' } };

export const Themes: Story = {
  render: (args) => (
    <ThemePair>
      {() => (
        <>
          <TextField {...args} hint="A short hint" />
          <TextField label="Filled" defaultValue="Ada Lovelace" />
        </>
      )}
    </ThemePair>
  ),
};
