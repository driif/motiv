import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  IconButton,
  IconButtonGroup,
} from '@driif/motiv/matrix';

function Icon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
      <path d={d} strokeLinecap="square" />
    </svg>
  );
}

export function CardDemo() {
  return (
    <Card style={{ maxWidth: '28rem' }}>
      <CardHeader
        titleAs="h4"
        title="Account"
        description="Operator profile and keys."
        actions={
          <IconButtonGroup label="Account actions">
            <IconButton icon={<Icon d="M4 20l4-1 11-11-3-3L5 16l-1 4z" />} label="Edit" />
            <IconButton icon={<Icon d="M5 7h14M9 7V4h6v3M7 7l1 13h8l1-13" />} label="Delete" />
          </IconButtonGroup>
        }
      />
      <CardBody>Three tokens issued, one revoked, no failed logins.</CardBody>
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
