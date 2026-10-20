import { RadioGroup } from '@driif/motiv';
import { useState } from 'react';

const plans = [
  { value: 'hobby', label: 'Hobby' },
  { value: 'team', label: 'Team' },
  { value: 'enterprise', label: 'Enterprise' },
];

export function RadioDemo() {
  const [plan, setPlan] = useState('team');
  return <RadioGroup name="plan" legend="Plan" options={plans} value={plan} onChange={setPlan} />;
}
