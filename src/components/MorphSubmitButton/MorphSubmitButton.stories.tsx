import type { Meta, StoryObj } from '@storybook/react-vite';
import { ThemePair } from '../../../.storybook/ThemePair';
import { MorphSubmitButton } from './MorphSubmitButton';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const meta = {
  title: 'Components/MorphSubmitButton',
  component: MorphSubmitButton,
  args: { onAction: () => wait(1200) },
} satisfies Meta<typeof MorphSubmitButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Failing: Story = {
  args: {
    label: 'Publish',
    onAction: () => wait(900).then(() => Promise.reject(new Error('offline'))),
  },
};

export const Themes: Story = {
  render: (args) => <ThemePair>{() => <MorphSubmitButton {...args} />}</ThemePair>,
};
