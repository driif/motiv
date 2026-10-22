import { Tooltip } from '@driif/motiv/matrix';

export function TooltipDemo() {
  return (
    <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '5rem' }}>
      Token TTL 24h
      <Tooltip content="Renew the token before it expires." label="About token TTL" />
    </p>
  );
}
