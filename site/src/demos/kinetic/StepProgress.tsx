import { Button, StepProgress } from '@driif/motiv';
import { useState } from 'react';

const steps = [
  { id: 'cart', label: 'Cart', description: 'Check what you are ordering.' },
  { id: 'ship', label: 'Shipping', description: 'Tell us where it should go.' },
  { id: 'pay', label: 'Payment', description: 'Card, invoice or bank transfer.' },
];

export function StepProgressDemo() {
  const [current, setCurrent] = useState(1);
  const completed = current >= steps.length;
  return (
    <div style={{ display: 'grid', gap: '1rem', width: '100%', maxWidth: '26rem' }}>
      <StepProgress
        steps={steps}
        current={current}
        completed={completed}
        completedText="Ordered."
      />
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <Button variant="ghost" disabled={current === 0} onClick={() => setCurrent(current - 1)}>
          Back
        </Button>
        <Button onClick={() => setCurrent(completed ? 0 : current + 1)}>
          {completed ? 'Start over' : 'Next'}
        </Button>
      </div>
    </div>
  );
}
