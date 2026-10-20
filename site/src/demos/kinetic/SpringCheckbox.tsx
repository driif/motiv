import { SpringCheckbox } from '@driif/motiv';

export function SpringCheckboxDemo() {
  return (
    <>
      <SpringCheckbox label="Email me a weekly summary" defaultChecked />
      <SpringCheckbox label="Share usage data" />
      <SpringCheckbox label="Beta features" disabled />
    </>
  );
}
