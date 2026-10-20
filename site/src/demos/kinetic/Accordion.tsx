import { Accordion } from '@driif/motiv';

const faq = [
  {
    id: 'trial',
    title: 'How long is the free trial?',
    content: 'Thirty days with every feature. No card needed until you decide to stay.',
  },
  {
    id: 'seats',
    title: 'Can I add seats later?',
    content: 'Any time from Settings → Billing. New seats are prorated to the day.',
  },
  {
    id: 'export',
    title: 'Can I take my data with me?',
    content: 'Export everything as CSV or JSON, whenever you like.',
  },
];

export function AccordionDemo() {
  return <Accordion items={faq} defaultOpen={['trial']} style={{ maxWidth: '26rem' }} />;
}
