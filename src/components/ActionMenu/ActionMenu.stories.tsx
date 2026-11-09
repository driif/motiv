import type { Meta, StoryObj } from '@storybook/react-vite';
import type { CSSProperties } from 'react';
import { ActionMenu } from './ActionMenu';

const noop = () => {};

const items = [
  { label: 'CSV', onSelect: noop },
  { label: 'XLSX', onSelect: noop, disabled: true },
  { label: 'JSON', onSelect: noop },
];

const meta = {
  title: 'Components/ActionMenu',
  component: ActionMenu,
  args: { label: 'Export', items, variant: 'outline' },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['primary', 'secondary', 'outline', 'ghost', 'danger'],
    },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof ActionMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Export: Story = {};

export const Loading: Story = { args: { loading: true } };

export const Disabled: Story = { args: { disabled: true } };

export const Empty: Story = { args: { items: [] } };

export const LongLabel: Story = {
  args: {
    label: 'Export the selected documents',
    items: [
      { label: 'Comma-separated values for spreadsheets and imports', onSelect: noop },
      { label: 'JSON', onSelect: noop },
    ],
  },
};

export const SubtreeTheme: Story = {
  render: (args) => (
    <div
      data-theme="dark"
      style={
        {
          padding: '1rem 1rem 10rem',
          background: 'var(--motiv-color-bg)',
          '--motiv-menu-bg': 'oklch(0.3 0.06 160)',
          '--motiv-menu-color': 'oklch(0.95 0.03 160)',
          '--motiv-menu-border-color': 'oklch(0.6 0.12 160)',
          '--motiv-menu-accent': 'oklch(0.8 0.15 160)',
        } as CSSProperties
      }
    >
      <ActionMenu {...args} />
    </div>
  ),
};
