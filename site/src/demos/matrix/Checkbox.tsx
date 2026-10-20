import { Checkbox } from '@driif/motiv/matrix';

export function CheckboxDemo() {
  return (
    <>
      <Checkbox label="Send me the newsletter" defaultChecked />
      <Checkbox label="Also the long one, on Sundays" />
    </>
  );
}
