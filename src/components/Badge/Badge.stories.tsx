import type { Meta, StoryObj } from '@storybook/react-vite';
import type { CSSProperties } from 'react';
import { ThemePair } from '../../../.storybook/ThemePair';
import { BadgeButton } from '../BadgeButton';
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
  title: 'Components/Badge',
  component: Badge,
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

export const Themes: Story = {
  render: () => (
    <ThemePair>
      {(theme) => (
        <>
          <ToneRow />
          <ToneRow size="md" />
          <div style={row}>
            <BadgeButton count={3} label="Inbox" />
            <Badge tone="success">Published</Badge>
          </div>
          <div
            data-theme={theme === 'light' ? 'dark' : 'light'}
            style={{ padding: '1rem', background: 'var(--motiv-color-bg)' }}
          >
            <ToneRow />
          </div>
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
          '--motiv-badge-radius': 'var(--motiv-radius-sm)',
        } as CSSProperties
      }
    >
      <ToneRow />
    </div>
  ),
};
