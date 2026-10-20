import { Button, cx } from '@driif/motiv';
import { useState } from 'react';

export function CxDemo() {
  const [urgent, setUrgent] = useState(false);
  const className = cx('note', urgent && 'note--urgent', null);
  return (
    <>
      <Button variant="outline" aria-pressed={urgent} onClick={() => setUrgent(!urgent)}>
        Urgent
      </Button>
      <code>className="{className}"</code>
    </>
  );
}
