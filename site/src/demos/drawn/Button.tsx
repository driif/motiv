import { Button, buttonClassName } from '@driif/motiv/drawn';

export function ButtonDemo() {
  return (
    <>
      <Button>Save</Button>
      <Button variant="outline">Preview</Button>
      <Button variant="ghost">Cancel</Button>
      <Button loading>Publishing</Button>
      <a href="#card" className={buttonClassName({ variant: 'secondary' })}>
        A link, dressed up
      </a>
    </>
  );
}
