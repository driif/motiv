import { Button, Progress } from '@driif/motiv';
import { useState } from 'react';

export function ProgressDemo() {
  const [uploaded, setUploaded] = useState(35);
  return (
    <>
      <Progress value={uploaded} label="Uploading" />
      <Button
        variant="outline"
        onClick={() => setUploaded(uploaded >= 100 ? 0 : Math.min(100, uploaded + 25))}
      >
        {uploaded >= 100 ? 'Start over' : 'Upload more'}
      </Button>
    </>
  );
}
