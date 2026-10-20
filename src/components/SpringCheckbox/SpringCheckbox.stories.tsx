import type { Meta, StoryObj } from '@storybook/react-vite';
import { ThemePair } from '../../../.storybook/ThemePair';
import { SpringCheckbox } from './SpringCheckbox';

const meta = {
  title: 'Components/SpringCheckbox',
  component: SpringCheckbox,
  args: { label: 'Email me a weekly summary' },
} satisfies Meta<typeof SpringCheckbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Checked: Story = { args: { defaultChecked: true } };

export const Disabled: Story = { args: { disabled: true, defaultChecked: true } };

export const Themes: Story = {
  render: (args) => <ThemePair>{() => <SpringCheckbox {...args} />}</ThemePair>,
};
