import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { ThemePair } from '../../../.storybook/ThemePair';
import { withMatrix } from '../../../.storybook/withMatrix';
import { GlitchThemeToggle } from './GlitchThemeToggle';

function Toggle() {
  const [dark, setDark] = useState(false);
  return <GlitchThemeToggle dark={dark} onToggle={() => setDark(!dark)} />;
}

const meta = {
  title: 'Matrix/GlitchThemeToggle',
  component: GlitchThemeToggle,
  decorators: [withMatrix],
  args: { dark: false, onToggle: () => {} },
} satisfies Meta<typeof GlitchThemeToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { render: () => <Toggle /> };

export const Themes: Story = {
  render: () => <ThemePair>{() => <Toggle />}</ThemePair>,
};
