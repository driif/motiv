import { Badge } from '@driif/motiv';

export function BadgeDemo() {
  return (
    <>
      <Badge>Draft</Badge>
      <Badge tone="success">Published</Badge>
      <Badge tone="warning">In review</Badge>
      <Badge tone="danger">Rejected</Badge>
      <Badge size="md">Draft</Badge>
      <Badge size="md" tone="success">
        Published
      </Badge>
      <Badge size="md" tone="warning">
        In review
      </Badge>
      <Badge size="md" tone="danger">
        Rejected
      </Badge>
    </>
  );
}
