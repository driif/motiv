import type { Meta, StoryObj } from '@storybook/react-vite';
import { type CSSProperties, useState } from 'react';
import { ThemePair } from '../../../.storybook/ThemePair';
import { Button } from '../Button';
import { Confirm, type ConfirmProps } from './Confirm';

function Example(args: ConfirmProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="danger" onClick={() => setOpen(true)}>
        Delete project
      </Button>
      <Confirm
        {...args}
        open={open}
        onCancel={() => setOpen(false)}
        onConfirm={() => setOpen(false)}
      />
    </>
  );
}

const meta = {
  title: 'Components/Confirm',
  component: Confirm,
  args: {
    open: false,
    title: 'Delete project?',
    children: <p>This action cannot be undone.</p>,
    onConfirm: () => {},
    onCancel: () => {},
  },
  render: (args) => <Example {...args} />,
} satisfies Meta<typeof Confirm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {};

export const Impact: Story = {
  args: {
    children: (
      <>
        <p>Deleting this project also removes:</p>
        <ul>
          <li>3 bindings</li>
          <li>12 permissions</li>
          <li>48 saved submissions</li>
        </ul>
        <p>This action cannot be undone.</p>
      </>
    ),
  },
};

export const Slug: Story = { args: { slug: 'my-project' } };

export const Pending: Story = {
  args: { pending: true, slug: 'my-project' },
};

export const LongContent: Story = {
  args: {
    title:
      'Permanently delete the project and every resource belonging to the entire organization?',
    slug: 'organization-project-with-a-very-long-slug-that-must-still-wrap-on-a-small-screen',
    confirmLabel: 'Permanently delete this project and its resources',
    cancelLabel: 'Keep this project and all its resources',
    children: (
      <>
        <p>Review every affected workspace before continuing.</p>
        <ul>
          {Array.from({ length: 30 }, (_, i) => `Workspace ${i + 1}`).map((workspace) => (
            <li key={workspace}>{workspace}: 12 permissions and 48 saved submissions</li>
          ))}
        </ul>
      </>
    ),
  },
};

export const Themes: Story = {
  render: (args) => <ThemePair>{() => <Example {...args} />}</ThemePair>,
};

export const Rethemed: Story = {
  render: (args) => (
    <div
      data-theme="light"
      style={
        {
          '--motiv-color-primary': '#2563eb',
          '--motiv-color-danger': '#b91c1c',
          '--motiv-radius': '0.25rem',
          '--motiv-button-radius': '0.25rem',
        } as CSSProperties
      }
    >
      <Example {...args} />
    </div>
  ),
};
