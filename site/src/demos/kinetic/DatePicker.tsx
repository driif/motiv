import { DatePicker } from '@driif/motiv';
import { useState } from 'react';

export function DatePickerDemo() {
  const [due, setDue] = useState('2026-11-13');
  return (
    <>
      <DatePicker
        label="Due date"
        value={due}
        onChange={(event) => setDue(event.target.value)}
        hint={`Value: "${due}"`}
      />
      <DatePicker
        label="Meeting"
        type="datetime-local"
        min="2026-11-02T09:00"
        hint="Not before 2 November 2026, 9:00."
      />
    </>
  );
}
