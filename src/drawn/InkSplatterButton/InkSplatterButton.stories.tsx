import type { Meta, StoryObj } from '@storybook/react-vite';
import { ThemePair } from '../../../.storybook/ThemePair';
import { withDrawn } from '../../../.storybook/withDrawn';
import { InkSplatterButton } from './InkSplatterButton';

const heart = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
    <path
      d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"
      strokeLinejoin="round"
    />
  </svg>
);

const meta = {
  title: 'Drawn/InkSplatterButton',
  component: InkSplatterButton,
  decorators: [withDrawn],
  args: { children: 'Like', successLabel: 'Liked', icon: heart },
} satisfies Meta<typeof InkSplatterButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Plain: Story = {
  args: { successLabel: undefined, icon: undefined, children: 'Splash' },
};

export const Disabled: Story = { args: { disabled: true } };

export const Themes: Story = {
  render: (args) => <ThemePair>{() => <InkSplatterButton {...args} />}</ThemePair>,
};
