import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { ThemePair } from '../../../.storybook/ThemePair';
import { withDrawn } from '../../../.storybook/withDrawn';
import { Switch } from './Switch';

function Demo({ initial = false, label = 'Wi-Fi' }) {
  const [checked, setChecked] = useState(initial);
  return <Switch checked={checked} onChange={setChecked} label={label} />;
}

const meta = {
  title: 'Drawn/Switch',
  component: Switch,
  decorators: [withDrawn],
  args: { checked: false, onChange: () => {}, label: 'Wi-Fi' },
  render: () => <Demo />,
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = { render: (args) => <Switch {...args} checked disabled /> };

export const Themes: Story = {
  render: () => (
    <ThemePair>
      {() => (
        <>
          <Demo initial />
          <Demo label="Sync over cellular" />
        </>
      )}
    </ThemePair>
  ),
};
