import { RadioGroup } from '@driif/motiv/drawn';
import { useState } from 'react';

const options = [
  { value: 'tea', label: 'Tea' },
  { value: 'coffee', label: 'Coffee' },
  { value: 'water', label: 'Water' },
];

export function RadioDemo() {
  const [drink, setDrink] = useState('tea');
  return (
    <RadioGroup name="drink" legend="Drink" options={options} value={drink} onChange={setDrink} />
  );
}
