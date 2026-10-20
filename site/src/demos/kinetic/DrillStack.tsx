import { DrillStack } from '@driif/motiv';
import { useState } from 'react';

const levels = [
  { id: 'acme', name: 'acme', meta: '2 regions' },
  { id: 'eu', name: 'eu-west', meta: '3 clusters' },
  { id: 'prod', name: 'prod', meta: '12 services' },
  { id: 'api', name: 'api-gateway', meta: '4 pods, all healthy' },
];

export function DrillStackDemo() {
  const [depth, setDepth] = useState(1);
  return (
    <DrillStack
      style={{ maxWidth: '22rem' }}
      path={levels.slice(0, depth + 1)}
      onNavigate={setDepth}
      onDrill={() => setDepth(depth + 1)}
      canDrill={depth < levels.length - 1}
    />
  );
}
