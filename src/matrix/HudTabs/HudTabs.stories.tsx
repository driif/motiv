import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { ThemePair } from '../../../.storybook/ThemePair';
import { withMatrix } from '../../../.storybook/withMatrix';
import { HudTabs } from './HudTabs';

const tabs = [
  { value: 'secrets', label: 'Secrets' },
  { value: 'policies', label: 'Policies' },
  { value: 'tokens', label: 'Tokens' },
  { value: 'audit', label: 'Audit' },
];

const panels = {
  secrets: '12 secrets in kv/app.',
  policies: '4 policies attached.',
  tokens: '2 tokens expire this week.',
  audit: 'Audit log is streaming.',
};

function Tabs() {
  const [value, setValue] = useState('secrets');
  return <HudTabs label="Vault" tabs={tabs} value={value} onChange={setValue} panels={panels} />;
}

const meta = {
  title: 'Matrix/HudTabs',
  component: HudTabs,
  decorators: [withMatrix],
  args: { label: 'Vault', tabs, value: 'secrets', onChange: () => {} },
} satisfies Meta<typeof HudTabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { render: () => <Tabs /> };

export const Themes: Story = {
  render: () => <ThemePair>{() => <Tabs />}</ThemePair>,
};
