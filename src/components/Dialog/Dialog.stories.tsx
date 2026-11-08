import type { Meta, StoryObj } from '@storybook/react-vite';
import { type CSSProperties, useState } from 'react';
import { Button } from '../Button';
import { TextField } from '../TextField';
import { Dialog, type DialogProps } from './Dialog';

function Example(args: DialogProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Edit question</Button>
      <Dialog {...args} open={open} onClose={() => setOpen(false)} />
    </>
  );
}

const meta = {
  title: 'Components/Dialog',
  component: Dialog,
  args: {
    open: false,
    title: 'Edit question',
    onClose: () => {},
    children: (
      <div style={{ display: 'grid', gap: '1rem' }}>
        <TextField label="Label" defaultValue="Date of birth" />
        <TextField label="Hint" />
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
          <Button variant="outline">Cancel</Button>
          <Button variant="primary">Save</Button>
        </div>
      </div>
    ),
  },
  render: (args) => <Example {...args} />,
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {};

export const Wide: Story = { args: { size: 'wide', title: 'Table configuration' } };

export const LongContent: Story = {
  args: {
    title: 'Table rows of the household members who share the applicant’s address',
    children: (
      <ol>
        {Array.from({ length: 40 }, (_, i) => `Row ${i + 1}`).map((row) => (
          <li key={row}>{row}: first name, last name, date of birth and relation</li>
        ))}
      </ol>
    ),
  },
};

export const Dark: Story = {
  render: (args) => (
    <div data-theme="dark" style={{ padding: '2rem', background: 'var(--motiv-color-bg)' }}>
      <Example {...args} />
    </div>
  ),
};

export const Rethemed: Story = {
  render: (args) => (
    <div
      data-theme="light"
      style={
        {
          '--motiv-radius-lg': '0.25rem',
          '--motiv-dialog-backdrop': 'rgb(30 58 138 / 0.55)',
        } as CSSProperties
      }
    >
      <Example {...args} />
    </div>
  ),
};
