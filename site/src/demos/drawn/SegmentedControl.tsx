import { SegmentedControl } from '@driif/motiv/drawn';
import { useState } from 'react';

const options = [
  { value: 'day', label: 'Day', hint: 'Compared with yesterday' },
  { value: 'week', label: 'Week', hint: 'Compared with last week' },
  { value: 'month', label: 'Month', hint: 'Compared with last month' },
];

export function SegmentedControlDemo() {
  const [range, setRange] = useState('week');
  return (
    <SegmentedControl
      label="Range"
      options={options}
      value={range}
      onChange={setRange}
      style={{ width: '20rem' }}
    />
  );
}
