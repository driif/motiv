import { Button, ProgressRing } from '@driif/motiv';
import { useState } from 'react';

export function ProgressRingDemo() {
  const [uploaded, setUploaded] = useState(35);
  return (
    <>
      <ProgressRing value={uploaded} label="Upload" />
      <Button
        variant="outline"
        onClick={() => setUploaded(uploaded >= 100 ? 0 : Math.min(100, uploaded + 25))}
      >
        {uploaded >= 100 ? 'Start over' : 'Upload more'}
      </Button>
    </>
  );
}
