import { HoldToConfirmButton } from '@driif/motiv/drawn';
import { useState } from 'react';

export function HoldToConfirmButtonDemo() {
  const [count, setCount] = useState(0);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
      <HoldToConfirmButton
        label="Hold to seal"
        confirmedLabel="Sealed"
        onConfirm={() => setCount(count + 1)}
      />
      <span>Sealed {count} times</span>
    </div>
  );
}
