import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  IconButton,
  IconButtonGroup,
} from '@driif/motiv/drawn';

function Icon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
      <path d={d} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CardDemo() {
  return (
    <Card style={{ maxWidth: '28rem' }}>
      <CardHeader
        title="Account"
        description="Make this sketchbook yours."
        actions={
          <IconButtonGroup label="Account actions">
            <IconButton icon={<Icon d="M4 20l4-1 11-11-3-3L5 16l-1 4z" />} label="Edit" />
            <IconButton icon={<Icon d="M5 7h14M9 7V4h6v3M7 7l1 13h8l1-13" />} label="Delete" />
          </IconButtonGroup>
        }
      />
      <CardBody>Three new sketches, one finished page, a lot of coffee.</CardBody>
      <CardFooter>
        <Button variant="ghost" size="sm">
          Cancel
        </Button>
        <Button variant="outline" size="sm">
          Save changes
        </Button>
      </CardFooter>
    </Card>
  );
}
