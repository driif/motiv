import type { Meta, StoryObj } from '@storybook/react-vite';
import { ThemePair } from '../../../.storybook/ThemePair';
import { FloatingField } from './FloatingField';

const meta = {
  title: 'Components/FloatingField',
  component: FloatingField,
  args: { label: 'Email', type: 'email', required: true, hint: 'We only use it to reply.' },
} satisfies Meta<typeof FloatingField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Filled: Story = { args: { defaultValue: 'ada@example.com' } };

export const WithoutValidity: Story = {
  args: { label: 'Nickname', type: 'text', required: false, hint: undefined, showValidity: false },
};

export const Disabled: Story = { args: { disabled: true } };

export const Themes: Story = {
  render: (args) => <ThemePair>{() => <FloatingField {...args} />}</ThemePair>,
};
