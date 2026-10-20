import { FloatingField } from '@driif/motiv';

export function FloatingFieldDemo() {
  return (
    <>
      <FloatingField label="Email" type="email" required hint="We only use it to reply." />
      <FloatingField label="Team name" defaultValue="Platform" showValidity={false} />
    </>
  );
}
