import { SplitButton } from '@driif/motiv/action-menu';
import { useState } from 'react';

export function SplitButtonDemo() {
  const [last, setLast] = useState('nothing yet');
  return (
    <div style={{ display: 'grid', alignContent: 'start', gap: '0.75rem', minHeight: '13rem' }}>
      <SplitButton
        onClick={() => setLast('New terminal')}
        items={[
          { label: 'Split right', onSelect: () => setLast('Split right') },
          { label: 'Split down', onSelect: () => setLast('Split down') },
          { label: 'New window', onSelect: () => setLast('New window'), disabled: true },
        ]}
      >
        New terminal
      </SplitButton>
      <span>Last action: {last}</span>
    </div>
  );
}
