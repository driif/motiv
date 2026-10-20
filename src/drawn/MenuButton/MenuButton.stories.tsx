import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { ThemePair } from '../../../.storybook/ThemePair';
import { withDrawn } from '../../../.storybook/withDrawn';
import { MenuButton } from '.';

function Demo({ initial = false }: { initial?: boolean }) {
  const [open, setOpen] = useState(initial);
  return <MenuButton open={open} onToggle={() => setOpen(!open)} />;
}

const meta = {
  title: 'Drawn/MenuButton',
  component: MenuButton,
  decorators: [withDrawn],
  args: { open: false, onToggle: () => {} },
  render: () => <Demo />,
} satisfies Meta<typeof MenuButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Open: Story = { render: () => <Demo initial /> };

export const Themes: Story = {
  render: () => (
    <ThemePair>
      {() => (
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Demo />
          <Demo initial />
        </div>
      )}
    </ThemePair>
  ),
};
