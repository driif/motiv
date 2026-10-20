import type { Meta, StoryObj } from '@storybook/react-vite';
import { ThemePair } from '../../../.storybook/ThemePair';
import { withDrawn } from '../../../.storybook/withDrawn';
import { Tooltip } from './Tooltip';

const meta = {
  title: 'Drawn/Tooltip',
  component: Tooltip,
  decorators: [withDrawn],
  args: { content: 'Leave a little room for the unexpected.' },
  render: (args) => (
    <p style={{ marginTop: '6rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      A curious detail <Tooltip {...args} />
    </p>
  ),
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Themes: Story = {
  render: (args) => (
    <ThemePair>
      {() => (
        <p style={{ marginTop: '6rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          Click the i <Tooltip {...args} />
        </p>
      )}
    </ThemePair>
  ),
};
