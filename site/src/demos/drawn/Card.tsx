import { Button, Card, CardBody, CardFooter, CardHeader } from '@driif/motiv/drawn';

export function CardDemo() {
  return (
    <Card style={{ maxWidth: '24rem' }}>
      <CardHeader title="Field notes" description="Week 42" />
      <CardBody>Three new sketches, one finished page, a lot of coffee.</CardBody>
      <CardFooter>
        <Button variant="outline" size="sm">
          Archive
        </Button>
        <Button size="sm">Open</Button>
      </CardFooter>
    </Card>
  );
}
