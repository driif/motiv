import { SlipCard } from '@driif/motiv';

export function SlipCardDemo() {
  return (
    <SlipCard
      style={{ maxWidth: '22rem' }}
      title="Morning pages"
      description="Three pages of longhand, first thing, before the day gets a say in it."
      note="Nobody reads them, not even you. That is the point."
    />
  );
}
