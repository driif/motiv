import { TextField } from '@driif/motiv/drawn';

export function TextFieldDemo() {
  return (
    <>
      <TextField label="Your name" defaultValue="Ada Lovelace" />
      <TextField
        label="Email address we can reach you at about this request"
        type="email"
        hint="We only use it to reply."
      />
    </>
  );
}
