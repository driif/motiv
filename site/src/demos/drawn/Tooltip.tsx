import { Tooltip } from '@driif/motiv/drawn';

export function TooltipDemo() {
  return (
    <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '5rem' }}>
      Delivery takes three days
      <Tooltip content="Leave a little room for the unexpected." label="About delivery" />
    </p>
  );
}
