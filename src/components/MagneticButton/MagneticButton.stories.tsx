import type { Meta, StoryObj } from '@storybook/react-vite';
import { ThemePair } from '../../../.storybook/ThemePair';
import { MagneticButton } from './MagneticButton';

const meta = {
  title: 'Components/MagneticButton',
  component: MagneticButton,
  args: { children: 'Start a project' },
} satisfies Meta<typeof MagneticButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Strong: Story = { args: { strength: 0.45 } };

export const Disabled: Story = { args: { disabled: true } };

export const Themes: Story = {
  render: (args) => <ThemePair>{() => <MagneticButton {...args} />}</ThemePair>,
};
