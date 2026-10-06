import type { Meta, StoryObj } from '@storybook/react-vite';
import type { CSSProperties } from 'react';
import { Button, buttonClassName } from './Button';

const meta = {
  title: 'Components/Button',
  component: Button,
  args: { children: 'Save' },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['primary', 'secondary', 'outline', 'ghost', 'danger'],
    },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

const row: CSSProperties = {
  display: 'flex',
  gap: '0.75rem',
  alignItems: 'center',
  flexWrap: 'wrap',
};

const PlusIcon = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
  >
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const ArrowIcon = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
  >
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const Primary: Story = {};

export const Variants: Story = {
  render: () => (
    <div style={row}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={row}>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <div style={row}>
      <Button iconLeft={<PlusIcon />}>Add user</Button>
      <Button variant="outline" iconRight={<ArrowIcon />}>
        Continue
      </Button>
    </div>
  ),
};

export const Loading: Story = { args: { loading: true } };

export const Disabled: Story = { args: { disabled: true } };

export const AsLink: Story = {
  render: () => (
    <a href="#top" className={buttonClassName({ variant: 'outline' })}>
      Link styled as a button
    </a>
  ),
};

export const SubtreeOverride: Story = {
  render: () => (
    <div
      style={
        {
          ...row,
          '--motiv-color-primary': '#a78bfa',
          '--motiv-color-on-primary': '#1e1b4b',
        } as CSSProperties
      }
    >
      <Button>Primary</Button>
      <Button variant="outline">Outline</Button>
    </div>
  ),
};
