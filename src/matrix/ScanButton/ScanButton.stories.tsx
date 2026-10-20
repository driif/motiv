import type { Meta, StoryObj } from '@storybook/react-vite';
import { ThemePair } from '../../../.storybook/ThemePair';
import { withMatrix } from '../../../.storybook/withMatrix';
import { ScanButton } from './ScanButton';

const meta = {
  title: 'Matrix/ScanButton',
  component: ScanButton,
  decorators: [withMatrix],
  args: { children: 'Access vault' },
} satisfies Meta<typeof ScanButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithoutArrow: Story = { args: { showArrow: false } };

export const Disabled: Story = { args: { disabled: true } };

export const Themes: Story = {
  render: (args) => <ThemePair>{() => <ScanButton {...args} />}</ThemePair>,
};
