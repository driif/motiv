import { SegmentedControl } from '@driif/motiv/drawn';
import { useState } from 'react';

const options = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
];

export function SegmentedControlDemo() {
  const [range, setRange] = useState('week');
  return <SegmentedControl label="Range" options={options} value={range} onChange={setRange} />;
}
