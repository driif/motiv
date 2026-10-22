import { TextField } from '@driif/motiv';

export function TextFieldDemo() {
  return (
    <>
      <TextField label="Your name" defaultValue="Ada Lovelace" />
      <TextField label="Email" type="email" hint="We only use it to reply." />
    </>
  );
}
