import { Slider } from '@driif/motiv/matrix';
import { useState } from 'react';

export function SliderDemo() {
  const [budget, setBudget] = useState(80);
  return (
    <Slider
      value={budget}
      onChange={setBudget}
      label="Monthly budget"
      max={200}
      step={5}
      format={(v) => `€${v}`}
      marks={[0, 100, 200]}
    />
  );
}
