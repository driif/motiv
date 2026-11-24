import type { Meta, StoryObj } from '@storybook/react-vite';
import { SplitButton } from './SplitButton';

const noop = () => {};

const meta = {
  title: 'Components/SplitButton',
  component: SplitButton,
  args: {
    children: 'New terminal',
    onClick: noop,
    items: [
      { label: 'Split right', onSelect: noop },
      { label: 'Split down', onSelect: noop, disabled: true },
      { label: 'New tab', onSelect: noop },
    ],
  },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['primary', 'secondary', 'outline', 'ghost', 'danger'],
    },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
  render: (args) => (
    <div style={{ minHeight: '12rem' }}>
      <SplitButton {...args} />
    </div>
  ),
} satisfies Meta<typeof SplitButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Outline: Story = { args: { variant: 'outline', size: 'sm' } };

export const Disabled: Story = { args: { disabled: true } };
