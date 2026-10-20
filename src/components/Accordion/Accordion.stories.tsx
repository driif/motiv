import type { Meta, StoryObj } from '@storybook/react-vite';
import { ThemePair } from '../../../.storybook/ThemePair';
import { Accordion } from './Accordion';

const items = [
  { id: 'shipping', title: 'How long does shipping take?', content: 'Two to four working days.' },
  {
    id: 'returns',
    title: 'Can I return an order?',
    content: 'Within thirty days, free of charge.',
  },
  { id: 'support', title: 'Who do I write to?', content: 'help@example.com answers within a day.' },
];

const meta = {
  title: 'Components/Accordion',
  component: Accordion,
  args: { items },
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Multiple: Story = { args: { multiple: true, defaultOpen: ['shipping'] } };

export const Themes: Story = {
  render: () => <ThemePair>{() => <Accordion items={items} />}</ThemePair>,
};
