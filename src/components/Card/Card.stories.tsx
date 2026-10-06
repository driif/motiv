import type { Meta, StoryObj } from '@storybook/react-vite';
import type { CSSProperties } from 'react';
import { Button } from '../Button/Button';
import { Card, CardBody, CardFooter, CardHeader } from './Card';

const meta = {
  title: 'Components/Card',
  component: Card,
  argTypes: {
    variant: { control: 'inline-radio', options: ['elevated', 'outlined', 'subtle'] },
    padding: { control: 'inline-radio', options: ['none', 'sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

const grid: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(14rem, 1fr))',
  gap: '1rem',
  padding: 0,
  margin: 0,
  listStyle: 'none',
};

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
    <div style={grid}>
      {(['elevated', 'outlined', 'subtle'] as const).map((variant) => (
        <Card key={variant} variant={variant}>
          <CardHeader title={variant} />
          <CardBody>Card body text.</CardBody>
        </Card>
      ))}
    </div>
  ),
};

export const Padding: Story = {
  render: () => (
    <div style={grid}>
      {(['none', 'sm', 'md', 'lg'] as const).map((padding) => (
        <Card key={padding} variant="outlined" padding={padding}>
          padding="{padding}"
        </Card>
      ))}
    </div>
  ),
};

export const Interactive: Story = {
  render: () => (
    <Card interactive tabIndex={0} style={{ maxWidth: '24rem' }}>
      <CardHeader title="Focusable card" description="Hover lifts; Tab shows the focus ring." />
    </Card>
  ),
};

export const AsListItems: Story = {
  render: () => (
    <ul style={grid}>
      {['Alpha', 'Beta', 'Gamma'].map((name) => (
        <Card key={name} as="li" variant="outlined">
          <CardHeader title={name} titleAs="h4" />
        </Card>
      ))}
    </ul>
  ),
};

const themed: CSSProperties = {
  padding: '1rem',
  color: 'var(--motiv-color-text)',
  background: 'var(--motiv-color-bg)',
};

export const NestedThemes: Story = {
  render: () => (
    <div style={grid}>
      {(['dark', 'light'] as const).map((outer) => {
        const inner = outer === 'dark' ? 'light' : 'dark';
        return (
          <div key={outer} data-theme={outer} style={themed}>
            <Card>
              <CardHeader title={`${outer} wrapper`} />
            </Card>
            <div data-theme={inner} style={{ ...themed, marginTop: '1rem' }}>
              <Card>
                <CardHeader title={`${inner} subtree`} description="Own theme inside the wrapper" />
                <CardFooter>
                  <Button size="sm">Action</Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        );
      })}
    </div>
  ),
};
