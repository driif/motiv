import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { ThemePair } from '../../../.storybook/ThemePair';
import { withDrawn } from '../../../.storybook/withDrawn';
import { OrbitalThemeToggle } from './OrbitalThemeToggle';

function Demo({ initial = false }: { initial?: boolean }) {
  const [dark, setDark] = useState(initial);
  return <OrbitalThemeToggle dark={dark} onToggle={() => setDark(!dark)} />;
}

const meta = {
  title: 'Drawn/OrbitalThemeToggle',
  component: OrbitalThemeToggle,
  decorators: [withDrawn],
  args: { dark: false, onToggle: () => {} },
  render: () => <Demo />,
} satisfies Meta<typeof OrbitalThemeToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Dark: Story = { render: () => <Demo initial /> };

export const Themes: Story = {
  render: () => <ThemePair>{(theme) => <Demo initial={theme === 'dark'} />}</ThemePair>,
};
