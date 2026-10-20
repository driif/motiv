import type { Meta, StoryObj } from '@storybook/react-vite';
import { ThemePair } from '../../../.storybook/ThemePair';
import { CopyField } from './CopyField';

const meta = {
  title: 'Components/CopyField',
  component: CopyField,
  args: { value: 'pnpm add @driif/motiv' },
} satisfies Meta<typeof CopyField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Masked: Story = { args: { value: 'sk_live_51HxQ2', display: 'sk_live_••••••' } };

export const Themes: Story = {
  render: (args) => <ThemePair>{() => <CopyField {...args} />}</ThemePair>,
};
