import type { Meta, StoryObj } from '@storybook/react-vite';
import { ThemePair } from '../../../.storybook/ThemePair';
import { withDrawn } from '../../../.storybook/withDrawn';
import { Carousel } from './Carousel';

const slides = [
  { id: 'policies', label: 'Policies', content: <b>Policies, versioned like code</b> },
  { id: 'secrets', label: 'Secrets', content: <b>Secrets that rotate themselves</b> },
  { id: 'audit', label: 'Audit', content: <b>Every read, written down</b> },
];

const meta = {
  title: 'Drawn/Carousel',
  component: Carousel,
  decorators: [withDrawn],
  args: { slides, label: 'Features' },
} satisfies Meta<typeof Carousel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const NoLoop: Story = { args: { loop: false } };

export const Themes: Story = {
  render: () => <ThemePair>{() => <Carousel slides={slides} label="Features" />}</ThemePair>,
};
