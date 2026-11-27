import type { Meta, StoryObj } from '@storybook/react-vite';
import type { CSSProperties } from 'react';
import { ThemePair } from '../../../.storybook/ThemePair';
import { withMatrix } from '../../../.storybook/withMatrix';
import { Badge } from './Badge';

const tones = ['neutral', 'success', 'warning', 'danger'] as const;
const row = { display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' } as const;

function ToneRow({ size }: { size?: 'sm' | 'md' }) {
  return (
    <div style={row}>
      {tones.map((tone) => (
        <Badge key={tone} tone={tone} size={size}>
          {tone}
        </Badge>
      ))}
    </div>
  );
}

const meta = {
  title: 'Matrix/Badge',
  component: Badge,
  decorators: [withMatrix],
  args: { children: 'Draft' },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Tones: Story = {
  render: () => (
    <div style={row}>
      <ToneRow />
      <Badge tone="warning">Waiting for review by the data protection officer</Badge>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '1rem' }}>
      <ToneRow size="sm" />
      <ToneRow size="md" />
    </div>
  ),
};

export const Stretched: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: '8rem', gap: '0.5rem' }}>
      <Badge tone="success">Live</Badge>
      <Badge size="md">Draft</Badge>
    </div>
  ),
};

export const Themes: Story = {
  render: () => (
    <ThemePair>
      {() => (
        <>
          <ToneRow />
          <ToneRow size="md" />
        </>
      )}
    </ThemePair>
  ),
};

export const TokenOverride: Story = {
  render: () => (
    <div
      style={
        {
          '--motiv-badge-bg': 'var(--motiv-color-primary)',
          '--motiv-badge-color': 'var(--motiv-color-on-primary)',
          '--motiv-badge-border-color': 'var(--motiv-color-primary)',
          '--motiv-badge-radius': 'var(--motiv-radius-full)',
        } as CSSProperties
      }
    >
      <ToneRow />
    </div>
  ),
};
