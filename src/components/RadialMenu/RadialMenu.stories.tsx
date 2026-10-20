import type { Meta, StoryObj } from '@storybook/react-vite';
import { ThemePair } from '../../../.storybook/ThemePair';
import { RadialMenu } from './RadialMenu';

const icon = (d: string) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.65"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d={d} />
  </svg>
);

const actions = [
  { id: 'note', label: 'Note', icon: icon('M5 19h14M7 15l9-9 2 2-9 9H7z'), onSelect: () => {} },
  {
    id: 'link',
    label: 'Link',
    icon: icon('M10 14l4-4M8 12l-2 2a3 3 0 0 0 4 4l2-2M16 12l2-2a3 3 0 0 0-4-4l-2 2'),
    onSelect: () => {},
  },
  {
    id: 'photo',
    label: 'Photo',
    icon: icon('M4 7h4l2-2h4l2 2h4v12H4zM12 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6z'),
    onSelect: () => {},
  },
];

const meta = {
  title: 'Components/RadialMenu',
  component: RadialMenu,
  args: { actions },
} satisfies Meta<typeof RadialMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Wide: Story = { args: { radius: 110, spread: 180 } };

export const Themes: Story = {
  render: (args) => <ThemePair>{() => <RadialMenu {...args} />}</ThemePair>,
};
