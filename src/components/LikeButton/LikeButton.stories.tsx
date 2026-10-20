import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { ThemePair } from '../../../.storybook/ThemePair';
import { LikeButton } from './LikeButton';

function Demo() {
  const [liked, setLiked] = useState(false);
  return <LikeButton liked={liked} count={128 + (liked ? 1 : 0)} onToggle={setLiked} />;
}

const meta = {
  title: 'Components/LikeButton',
  component: LikeButton,
  args: { liked: false, count: 128, onToggle: () => {} },
  render: () => <Demo />,
} satisfies Meta<typeof LikeButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Liked: Story = { args: { liked: true }, render: (args) => <LikeButton {...args} /> };

export const Themes: Story = { render: () => <ThemePair>{() => <Demo />}</ThemePair> };
