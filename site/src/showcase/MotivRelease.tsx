import { Button, buttonClassName, Card, CardBody, CardFooter, CardHeader } from '@driif/motiv';

const regions = [
  { name: 'Frankfurt', status: 'Live for 41 days', latency: '18 ms' },
  { name: 'Zürich', status: 'Live for 12 days', latency: '22 ms' },
  { name: 'Kyiv', status: 'Rolling out', latency: '31 ms' },
];

export function MotivRelease() {
  return (
    <div className="site-release">
      <Card as="section" padding="lg" className="site-release__lead" aria-label="Release 2.4">
        <CardHeader
          title="Release 2.4 is ready"
          titleAs="h2"
          description="Built 6 minutes ago from main · 128 checks passed"
        />
        <CardBody>
          Ship it to every region at once, or start with one and watch the numbers first.
        </CardBody>
        <CardFooter>
          <a href="#button" className={buttonClassName({ variant: 'ghost' })}>
            Changelog
          </a>
          <Button variant="outline">Canary first</Button>
          <Button>Deploy everywhere</Button>
        </CardFooter>
      </Card>
      {regions.map((region) => (
        <Card key={region.name} as="article" variant="outlined" padding="sm">
          <CardHeader title={region.name} titleAs="h3" description={region.status} />
          <CardBody>p50 latency {region.latency}</CardBody>
        </Card>
      ))}
    </div>
  );
}
