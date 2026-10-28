import { Button, Card, CardBody, CardFooter, CardHeader } from '@driif/motiv';

export function CardDemo() {
  return (
    <Card style={{ maxWidth: '24rem' }}>
      <CardHeader titleAs="h4" title="Users" description="Active this week" />
      <CardBody>128 people signed in at least once during the last seven days.</CardBody>
      <CardFooter>
        <Button variant="outline" size="sm">
          Export
        </Button>
        <Button size="sm">View all</Button>
      </CardFooter>
    </Card>
  );
}
