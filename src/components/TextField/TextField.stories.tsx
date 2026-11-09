import type { Meta, StoryObj } from '@storybook/react-vite';
import { assertFieldLayout, longLabel, longValue } from '../../../.storybook/assertFieldLayout';
import { ThemePair } from '../../../.storybook/ThemePair';
import { TextField } from './TextField';

const meta = {
  title: 'Components/TextField',
  component: TextField,
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

export const LongLabel: Story = {
  args: { label: longLabel },
  play: ({ canvasElement }) => assertFieldLayout(canvasElement, longValue),
};

export const Themes: Story = {
  render: (args) => <ThemePair>{() => <TextField {...args} hint="A short hint" />}</ThemePair>,
};
