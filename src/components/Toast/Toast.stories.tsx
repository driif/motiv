import type { Meta, StoryObj } from '@storybook/react-vite';
import { type CSSProperties, useEffect, useRef } from 'react';
import { Button } from '../Button';
import { dismissToast, Toaster, type ToasterProps, type ToastOptions, toast } from './Toast';

function Example({ options, ...args }: ToasterProps & { options?: ToastOptions }) {
  const ids = useRef<string[]>([]);
  useEffect(() => {
    const current = ids.current;
    return () => {
      for (const id of current) dismissToast(id);
    };
  }, []);
  return (
    <div
      style={{
        minHeight: '24rem',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '1rem',
        flexWrap: 'wrap',
      }}
    >
      {(options
        ? [options]
        : ([
            { tone: 'success', title: 'Changes saved', description: 'Your project is up to date.' },
            {
              tone: 'error',
              title: 'Could not save',
              description: 'Please try again. This message stays until dismissed.',
            },
            { tone: 'info', title: 'Sync started', description: 'You can keep working.' },
          ] satisfies ToastOptions[])
      ).map((entry) => (
        <Button key={entry.title} onClick={() => ids.current.push(toast(entry))}>
          Show {entry.tone ?? 'info'}
        </Button>
      ))}
      <Toaster {...args} />
    </div>
  );
}

const meta = {
  title: 'Components/Toast',
  component: Toaster,
  render: (args) => <Example {...args} />,
} satisfies Meta<typeof Toaster>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllTones: Story = {};
export const Success: Story = {
  render: (args) => <Example {...args} options={{ tone: 'success', title: 'Changes saved' }} />,
};
export const PersistentError: Story = {
  render: (args) => (
    <Example
      {...args}
      options={{
        tone: 'error',
        title: 'Could not save',
        description: 'Check your connection and try again.',
      }}
    />
  ),
};
export const Info: Story = {
  render: (args) => <Example {...args} options={{ title: 'Sync started' }} />,
};
export const LongContent: Story = {
  render: (args) => (
    <Example
      {...args}
      options={{
        title: 'Your project and all of its linked workspaces have been updated successfully',
        description:
          'Changes for organization-project-with-a-very-long-slug-that-must-wrap-on-small-screens are now available to everyone in the workspace.',
        duration: Infinity,
      }}
    />
  ),
};
export const Dark: Story = {
  render: (args) => (
    <div data-theme="dark">
      <Example {...args} />
    </div>
  ),
};
export const Rethemed: Story = {
  render: (args) => (
    <div
      data-theme="light"
      style={{ '--motiv-color-primary': '#2563eb', '--motiv-radius': '0.25rem' } as CSSProperties}
    >
      <Example {...args} />
    </div>
  ),
};
