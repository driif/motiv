import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { HudTabs } from './HudTabs';

const tabs = [
  { value: 'kv', label: 'KV' },
  { value: 'pki', label: 'PKI' },
  { value: 'ssh', label: 'SSH' },
];

function Controlled() {
  const [value, setValue] = useState('kv');
  return (
    <HudTabs
      label="Engines"
      tabs={tabs}
      value={value}
      onChange={setValue}
      panels={{ kv: 'Key/value', pki: 'Certificates', ssh: 'Keys' }}
    />
  );
}

describe('HudTabs', () => {
  it('is a labelled tablist with roving tabindex and linked panels', () => {
    render(<Controlled />);
    expect(screen.getByRole('tablist', { name: 'Engines' })).toBeInTheDocument();
    const kv = screen.getByRole('tab', { name: 'KV' });
    expect(kv).toHaveAttribute('aria-selected', 'true');
    expect(kv).toHaveAttribute('tabindex', '0');
    expect(screen.getByRole('tab', { name: 'PKI' })).toHaveAttribute('tabindex', '-1');
    const panel = screen.getByRole('tabpanel', { name: 'KV' });
    expect(panel).toHaveTextContent('Key/value');
    expect(kv).toHaveAttribute('aria-controls', panel.id);
  });

  it('moves selection and focus with arrows, wrapping, Home and End', () => {
    render(<Controlled />);
    const kv = screen.getByRole('tab', { name: 'KV' });
    kv.focus();
    fireEvent.keyDown(kv, { key: 'ArrowLeft' });
    expect(screen.getByRole('tab', { name: 'SSH' })).toHaveFocus();
    expect(screen.getByRole('tab', { name: 'SSH' })).toHaveAttribute('aria-selected', 'true');
    fireEvent.keyDown(document.activeElement as Element, { key: 'ArrowRight' });
    expect(screen.getByRole('tab', { name: 'KV' })).toHaveFocus();
    fireEvent.keyDown(document.activeElement as Element, { key: 'End' });
    expect(screen.getByRole('tab', { name: 'SSH' })).toHaveFocus();
    fireEvent.keyDown(document.activeElement as Element, { key: 'Home' });
    expect(screen.getByRole('tab', { name: 'KV' })).toHaveFocus();
  });

  it('selects on click and shows the status readout', () => {
    render(<Controlled />);
    expect(screen.getByText('TARGET 01 / 03 · KV LOCKED')).toHaveAttribute('aria-hidden', 'true');
    fireEvent.click(screen.getByRole('tab', { name: 'PKI' }));
    expect(screen.getByRole('tabpanel', { name: 'PKI' })).toHaveTextContent('Certificates');
    expect(screen.getByText('TARGET 02 / 03 · PKI LOCKED')).toBeInTheDocument();
  });

  it('renders without panels or status and takes custom readout words', () => {
    const { rerender } = render(
      <HudTabs label="Engines" tabs={tabs} value="ssh" onChange={() => {}} showStatus={false} />,
    );
    expect(screen.queryByRole('tabpanel')).toBeNull();
    expect(screen.getByRole('tab', { name: 'SSH' })).not.toHaveAttribute('aria-controls');
    expect(screen.queryByText(/LOCKED/)).toBeNull();
    rerender(
      <HudTabs
        label="Engines"
        tabs={tabs}
        value="ssh"
        onChange={() => {}}
        targetLabel="ZIEL"
        lockedLabel="FIXIERT"
      />,
    );
    expect(screen.getByText('ZIEL 03 / 03 · SSH FIXIERT')).toBeInTheDocument();
  });
});
