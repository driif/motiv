import { HudTabs } from '@driif/motiv/matrix';
import { useState } from 'react';

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
  audit: 'Audit log is streaming. '.repeat(30),
};

export function HudTabsDemo() {
  const [tab, setTab] = useState('secrets');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '24rem', height: '12rem' }}>
      <HudTabs label="Vault" tabs={tabs} value={tab} onChange={setTab} panels={panels} fill />
    </div>
  );
}
