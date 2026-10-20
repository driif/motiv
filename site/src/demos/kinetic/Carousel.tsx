import { Carousel } from '@driif/motiv';

const slides = [
  { id: 'policies', label: 'Policies', content: <strong>Policies, versioned like code</strong> },
  { id: 'secrets', label: 'Secrets', content: <strong>Secrets that rotate themselves</strong> },
  { id: 'audit', label: 'Audit', content: <strong>Every read, written down</strong> },
];

export function CarouselDemo() {
  return <Carousel label="Features" slides={slides} />;
}
