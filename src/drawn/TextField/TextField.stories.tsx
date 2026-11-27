import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  assertFieldLayout,
  longLabel,
  longValue,
  wideLabel,
} from '../../../.storybook/assertFieldLayout';
import { ThemePair } from '../../../.storybook/ThemePair';
import { withDrawn } from '../../../.storybook/withDrawn';
import { TextField } from './TextField';

const meta = {
  title: 'Drawn/TextField',
  component: TextField,
  decorators: [withDrawn],
  args: { label: 'Your name' },
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithHint: Story = {
  args: { label: 'Email', type: 'email', hint: 'We only use it to reply.' },
};

export const Filled: Story = { args: { defaultValue: 'Ada Lovelace' } };

export const Disabled: Story = { args: { disabled: true, defaultValue: 'Read only' } };

export const LabelAbove: Story = {
  args: { labelPosition: 'above', hint: 'We only use it to reply.' },
};

export const LabelHidden: Story = {
  args: { labelPosition: 'hidden', defaultValue: 'Rename me' },
};

export const Color: Story = { args: { type: 'color', label: 'Accent', defaultValue: '#3b82f6' } };

export const LongLabel: Story = {
  args: { label: longLabel },
  render: (args) => (
    <div style={{ display: 'grid', gap: '1rem' }}>
      <TextField {...args} />
      <TextField {...args} label={wideLabel} />
    </div>
  ),
  play: ({ canvasElement }) => assertFieldLayout(canvasElement, longValue),
};

export const Themes: Story = {
  render: (args) => (
    <ThemePair>
      {() => (
        <>
          <TextField {...args} hint="A short hint" />
          <TextField label="Filled" defaultValue="Ada Lovelace" />
        </>
      )}
    </ThemePair>
  ),
};
