import { FloatingField } from '@driif/motiv';

export function FloatingFieldDemo() {
  return (
    <>
      <FloatingField label="Email" type="email" required hint="We only use it to reply." />
      <FloatingField
        label="Team name as it should appear on every invoice"
        defaultValue="Platform"
        showValidity={false}
      />
    </>
  );
}
