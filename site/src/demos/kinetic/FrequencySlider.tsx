import { FrequencySlider } from '@driif/motiv';
import { useState } from 'react';

export function FrequencySliderDemo() {
  const [volume, setVolume] = useState(60);
  return <FrequencySlider value={volume} onChange={setVolume} label="Volume" />;
}
