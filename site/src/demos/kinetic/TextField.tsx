import { TextField } from '@driif/motiv';

export function TextFieldDemo() {
  return (
    <>
      <TextField label="Your name" defaultValue="Ada Lovelace" />
      <TextField
        label="Email address we can reach you at about this request"
        type="email"
        hint="We only use it to reply."
      />
      <TextField label="City" labelPosition="above" />
      <TextField label="Project name" labelPosition="hidden" defaultValue="Inline rename" />
      <TextField label="Accent" type="color" defaultValue="#756383" />
    </>
  );
}
