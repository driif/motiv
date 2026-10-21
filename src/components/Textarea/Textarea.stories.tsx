import type { Meta, StoryObj } from '@storybook/react-vite';
import { ThemePair } from '../../../.storybook/ThemePair';
import { Textarea } from './Textarea';

const meta = {
  title: 'Components/Textarea',
  component: Textarea,
  args: { label: 'Message', placeholder: 'Write a message', rows: 1, maxRows: 6 },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithHint: Story = { args: { hint: 'Enter sends, Shift+Enter adds a line.' } };

export const HiddenLabel: Story = { args: { hideLabel: true } };

export const Filled: Story = {
  args: {
    defaultValue:
      'Line one\nLine two\nLine three\nLine four\nLine five\nLine six\nLine seven\nLine eight',
  },
};

export const Disabled: Story = { args: { disabled: true } };

export const Themes: Story = {
  render: (args) => <ThemePair>{() => <Textarea {...args} />}</ThemePair>,
};
