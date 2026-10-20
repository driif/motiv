import type { Meta, StoryObj } from '@storybook/react-vite';
import { ThemePair } from '../../../.storybook/ThemePair';
import { withDrawn } from '../../../.storybook/withDrawn';
import { Button } from '../Button';
import { Card, CardBody, CardFooter, CardHeader } from './Card';

const meta = {
  title: 'Drawn/Card',
  component: Card,
  decorators: [withDrawn],
  argTypes: {
    variant: { control: 'inline-radio', options: ['elevated', 'outlined', 'subtle'] },
    padding: { control: 'inline-radio', options: ['none', 'sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Card {...args} style={{ maxWidth: '24rem' }}>
      <CardHeader
        title="Users"
        description="Active this week"
        actions={
          <Button size="sm" variant="ghost">
            Refresh
          </Button>
        }
      />
      <CardBody>128 people signed in at least once during the last seven days.</CardBody>
      <CardFooter>
        <Button variant="outline" size="sm">
          Export
        </Button>
        <Button size="sm">View all</Button>
      </CardFooter>
    </Card>
  ),
};

export const Variants: Story = {
  render: () => (
    <ThemePair>
      {() =>
        (['elevated', 'outlined', 'subtle'] as const).map((variant) => (
          <Card key={variant} variant={variant}>
            <CardHeader title={variant} description="Card description" />
            <CardBody>Card body text.</CardBody>
          </Card>
        ))
      }
    </ThemePair>
  ),
};

export const Interactive: Story = {
  render: () => (
    <ThemePair>
      {() => (
        <Card interactive tabIndex={0}>
          <CardHeader title="Focusable card" description="Hover lifts; Tab shows the focus ring." />
        </Card>
      )}
    </ThemePair>
  ),
};
