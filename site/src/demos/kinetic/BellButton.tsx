import { BellButton, Button } from '@driif/motiv';
import { useState } from 'react';

export function BellButtonDemo() {
  const [unseen, setUnseen] = useState(2);
  return (
    <>
      <BellButton count={unseen} onClick={() => setUnseen(0)} />
      <Button size="sm" variant="outline" onClick={() => setUnseen(unseen + 1)}>
        Simulate a mention
      </Button>
    </>
  );
}
