import { Button, Odometer } from '@driif/motiv';
import { useState } from 'react';

export function OdometerDemo() {
  const [visitors, setVisitors] = useState(1284);
  return (
    <>
      <span style={{ fontSize: '2.25rem' }} role="img" aria-label={`${visitors} visitors today`}>
        <Odometer value={visitors} minDigits={5} dimLeadingZeros />
      </span>
      <Button size="sm" variant="outline" onClick={() => setVisitors(visitors + 37)}>
        Refresh
      </Button>
    </>
  );
}
