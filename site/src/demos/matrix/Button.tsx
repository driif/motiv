import { Button, buttonClassName } from '@driif/motiv/matrix';

export function ButtonDemo() {
  return (
    <>
      <Button>Deploy</Button>
      <Button variant="outline">Dry run</Button>
      <Button variant="ghost">Cancel</Button>
      <Button variant="danger">Revoke</Button>
      <Button loading>Syncing</Button>
      <a href="#card" className={buttonClassName({ variant: 'secondary' })}>
        A link, dressed up
      </a>
    </>
  );
}
