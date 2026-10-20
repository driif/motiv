import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { ThemePair } from '../../../.storybook/ThemePair';
import { MuteToggle } from './MuteToggle';

function Demo({ initial = false }: { initial?: boolean }) {
  const [muted, setMuted] = useState(initial);
  return <MuteToggle muted={muted} onChange={setMuted} />;
}

const meta = {
  title: 'Components/MuteToggle',
  component: MuteToggle,
  args: { muted: false, onChange: () => {} },
  render: () => <Demo />,
} satisfies Meta<typeof MuteToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Muted: Story = { render: () => <Demo initial /> };

export const Themes: Story = { render: () => <ThemePair>{() => <Demo />}</ThemePair> };
