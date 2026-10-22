import { Checkbox } from '@driif/motiv';

export function CheckboxDemo() {
  return (
    <>
      <Checkbox label="Email me a weekly summary" defaultChecked />
      <Checkbox label="Share usage data" />
    </>
  );
}
