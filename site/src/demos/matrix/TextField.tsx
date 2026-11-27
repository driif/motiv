import { TextField } from '@driif/motiv/matrix';

export function TextFieldDemo() {
  return (
    <>
      <TextField label="Your name" defaultValue="Ada Lovelace" />
      <TextField label="Email" type="email" hint="We only use it to reply." />
      <TextField label="Session name" labelPosition="hidden" defaultValue="tty-01" />
      <TextField label="Accent" type="color" defaultValue="#3b82f6" />
    </>
  );
}
