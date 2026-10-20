import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { ThemePair } from '../../../.storybook/ThemePair';
import { DrillStack } from './DrillStack';

const levels = [
  { id: 'acme', name: 'acme', meta: '2 regions' },
  { id: 'eu', name: 'eu-west', meta: '3 clusters' },
  { id: 'prod', name: 'prod', meta: '12 services' },
  { id: 'api', name: 'api-gateway', meta: '4 pods' },
];

function Demo() {
  const [depth, setDepth] = useState(1);
  return (
    <DrillStack
      path={levels.slice(0, depth + 1)}
      onNavigate={setDepth}
      onDrill={() => setDepth(depth + 1)}
      canDrill={depth < levels.length - 1}
    />
  );
}

const meta = {
  title: 'Components/DrillStack',
  component: DrillStack,
  args: { path: levels.slice(0, 2), onNavigate: () => {} },
  render: () => <Demo />,
} satisfies Meta<typeof DrillStack>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Themes: Story = {
  render: () => <ThemePair>{() => <Demo />}</ThemePair>,
};
