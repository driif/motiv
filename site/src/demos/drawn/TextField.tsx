import { TextField } from '@driif/motiv/drawn';

export function TextFieldDemo() {
  return (
    <>
      <TextField label="Your name" defaultValue="Ada Lovelace" />
      <TextField label="Email" type="email" hint="We only use it to reply." />
    </>
  );
}
