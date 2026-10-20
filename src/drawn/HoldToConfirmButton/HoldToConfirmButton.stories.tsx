import type { Meta, StoryObj } from '@storybook/react-vite';
import { ThemePair } from '../../../.storybook/ThemePair';
import { withDrawn } from '../../../.storybook/withDrawn';
import { HoldToConfirmButton } from './HoldToConfirmButton';

const meta = {
  title: 'Drawn/HoldToConfirmButton',
  component: HoldToConfirmButton,
  decorators: [withDrawn],
  args: { onConfirm: () => {} },
} satisfies Meta<typeof HoldToConfirmButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CustomLabels: Story = {
  args: { label: 'Hold to delete', holdingLabel: 'Deleting…', confirmedLabel: 'Deleted' },
};

export const Disabled: Story = { args: { disabled: true } };

export const Themes: Story = {
  render: (args) => <ThemePair>{() => <HoldToConfirmButton {...args} />}</ThemePair>,
};
