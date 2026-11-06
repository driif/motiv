import type { Meta, StoryObj } from '@storybook/react-vite';
import type { CSSProperties } from 'react';
import { ThemePair } from '../../../.storybook/ThemePair';
import { withMatrix } from '../../../.storybook/withMatrix';
import { DatePicker } from './DatePicker';

const meta = {
  title: 'Matrix/DatePicker',
  component: DatePicker,
  decorators: [withMatrix],
  args: { label: 'Due date' },
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DateEmpty: Story = {};

export const DateFilled: Story = { args: { defaultValue: '2026-11-13', hint: 'Pick a weekday.' } };

export const DateTimeFilled: Story = {
  args: { label: 'Meeting', type: 'datetime-local', defaultValue: '2026-11-13T09:30' },
};

export const Disabled: Story = { args: { disabled: true, defaultValue: '2026-11-13' } };

export const ReadOnly: Story = { args: { readOnly: true, defaultValue: '2026-11-13' } };

export const Narrow: Story = {
  args: {
    label: 'Meeting starts on the first working day',
    type: 'datetime-local',
    defaultValue: '2026-11-13T09:30',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '12rem' }}>
        <Story />
      </div>
    ),
  ],
};

export const Themes: Story = {
  render: (args) => (
    <ThemePair>
      {() => (
        <>
          <DatePicker {...args} defaultValue="2026-11-13" hint="A short hint" />
          <DatePicker {...args} label="Meeting" type="datetime-local" />
        </>
      )}
    </ThemePair>
  ),
};

export const Rethemed: Story = {
  args: { defaultValue: '2026-11-13' },
  render: (args) => (
    <div
      style={
        {
          '--motiv-text-field-bg': '#eff6ff',
          '--motiv-text-field-border-color': '#93c5fd',
          '--motiv-text-field-color': '#1e3a8a',
          '--motiv-text-field-radius': '0.25rem',
          '--motiv-text-field-accent': '#2563eb',
        } as CSSProperties
      }
    >
      <DatePicker {...args} />
    </div>
  ),
};
