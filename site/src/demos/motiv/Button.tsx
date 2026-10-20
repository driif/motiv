import { Button, buttonClassName } from '@driif/motiv';

export function ButtonDemo() {
  return (
    <>
      <Button>Deploy</Button>
      <Button variant="secondary">Schedule</Button>
      <Button variant="outline">Preview</Button>
      <Button variant="danger" size="sm">
        Delete
      </Button>
      <Button loading>Saving</Button>
      <a href="#card" className={buttonClassName({ variant: 'ghost' })}>
        A link, dressed up
      </a>
    </>
  );
}
