import { SplitButton } from '@driif/motiv/action-menu';
import { useState } from 'react';

function Icon({ d }: { d: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.65}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  );
}

export function SplitButtonDemo() {
  const [last, setLast] = useState('nothing yet');
  return (
    <div style={{ display: 'grid', alignContent: 'start', gap: '0.75rem', minHeight: '13rem' }}>
      <SplitButton
        onClick={() => setLast('New terminal')}
        items={[
          {
            label: 'Split right',
            onSelect: () => setLast('Split right'),
            icon: <Icon d="M4 4h16v16H4zM12 4v16" />,
          },
          {
            label: 'Split down',
            onSelect: () => setLast('Split down'),
            icon: <Icon d="M4 4h16v16H4zM4 12h16" />,
          },
          {
            label: 'New window',
            onSelect: () => setLast('New window'),
            icon: <Icon d="M4 6h16v14H4zM4 10h16" />,
            disabled: true,
            disabledReason: 'Only one window on this plan',
          },
        ]}
      >
        New terminal
      </SplitButton>
      <span>Last action: {last}</span>
    </div>
  );
}
