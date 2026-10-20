import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { ThemePair } from '../../../.storybook/ThemePair';
import { withDrawn } from '../../../.storybook/withDrawn';
import { Select, type SelectProps } from './Select';

const options = [
  { value: 'en', label: 'English', code: 'EN', hint: 'Default language' },
  { value: 'de', label: 'Deutsch', code: 'DE', hint: 'German' },
  { value: 'fr', label: 'Français', code: 'FR', hint: 'French' },
  { value: 'uk', label: 'Українська', code: 'UK', hint: 'Ukrainian' },
];

function Demo(props: Partial<SelectProps>) {
  const [value, setValue] = useState('');
  return (
    <div style={{ minHeight: '20rem' }}>
      <Select label="Language" options={options} value={value} onChange={setValue} {...props} />
    </div>
  );
}

const meta = {
  title: 'Drawn/Select',
  component: Select,
  decorators: [withDrawn],
  args: { label: 'Language', options, value: '', onChange: () => {} },
  render: () => <Demo />,
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = { render: () => <Demo disabled /> };

export const LongList: Story = {
  render: () => (
    <Demo
      options={Array.from({ length: 30 }, (_, i) => ({ value: `${i}`, label: `Option ${i + 1}` }))}
    />
  ),
};

export const Themes: Story = {
  render: () => <ThemePair>{() => <Demo />}</ThemePair>,
};
