import type { Meta, StoryObj } from '@storybook/react-vite';
import { ThemePair } from '../../../.storybook/ThemePair';
import { withDrawn } from '../../../.storybook/withDrawn';
import { Progress } from './Progress';

const meta = {
  title: 'Drawn/Progress',
  component: Progress,
  decorators: [withDrawn],
  args: { value: 62, label: 'Uploading' },
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Complete: Story = { args: { value: 100, label: 'Done' } };

export const WithoutValue: Story = { args: { showValue: false } };

export const Themes: Story = {
  render: (args) => <ThemePair>{() => <Progress {...args} />}</ThemePair>,
};
