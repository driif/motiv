import { MomentumSlider } from '@driif/motiv';
import { useState } from 'react';

export function MomentumSliderDemo() {
  const [budget, setBudget] = useState(80);
  return (
    <MomentumSlider
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
