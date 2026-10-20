import type { Meta, StoryObj } from '@storybook/react-vite';
import { ThemePair } from '../../../.storybook/ThemePair';
import { SlipCard } from './SlipCard';

const meta = {
  title: 'Components/SlipCard',
  component: SlipCard,
  args: {
    title: 'Morning pages',
    description: 'Three pages of longhand, first thing, before the day gets a say in it.',
    note: 'Nobody reads them, not even you. That is the point.',
  },
  render: (args) => (
    <div style={{ maxWidth: '22rem' }}>
      <SlipCard {...args} />
    </div>
  ),
} satisfies Meta<typeof SlipCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Themes: Story = {
  render: (args) => <ThemePair>{() => <SlipCard {...args} />}</ThemePair>,
};
