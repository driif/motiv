import type { Meta, StoryObj } from '@storybook/react-vite';
import { ThemePair } from '../../../.storybook/ThemePair';
import { withDrawn } from '../../../.storybook/withDrawn';
import { SplitButton } from './SplitButton';

const noop = () => {};

const meta = {
  title: 'Drawn/SplitButton',
  component: SplitButton,
  decorators: [withDrawn],
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

const square = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.65} aria-hidden="true">
    <rect x="4" y="4" width="16" height="16" rx="2" />
  </svg>
);

export const WithIcons: Story = {
  args: {
    items: [
      { label: 'Split right', onSelect: noop, icon: square },
      {
        label: 'Split down',
        onSelect: noop,
        icon: square,
        disabled: true,
        disabledReason: 'The pane is too small',
      },
      { label: 'New tab', onSelect: noop, icon: square },
    ],
  },
};

export const Themes: Story = {
  render: (args) => <ThemePair>{() => <SplitButton {...args} />}</ThemePair>,
};
