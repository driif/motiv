import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { ThemePair } from '../../../.storybook/ThemePair';
import type { SelectProps } from '../../drawn/Select';
import { Table } from '../Table/Table';
import { Select } from './Select';

const options = [
  { value: 'en', label: 'English', code: 'EN', hint: 'Default language' },
  { value: 'de', label: 'Deutsch', code: 'DE', hint: 'German' },
  { value: 'fr', label: 'Français', code: 'FR', hint: 'French' },
  { value: 'uk', label: 'Українська', code: 'UK', hint: 'Ukrainian' },
];

function Demo(props: Partial<SelectProps>) {
  const [value, setValue] = useState('');
  return (
    <div style={{ maxWidth: '20rem', minHeight: '20rem' }}>
      <Select label="Language" options={options} value={value} onChange={setValue} {...props} />
    </div>
  );
}

const meta = {
  title: 'Components/Select',
  component: Select,
  args: { label: 'Language', options, value: '', onChange: () => {} },
  render: () => <Demo />,
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Clearable: Story = { render: () => <Demo clearable /> };

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

export const InsideTable: Story = {
  render: () => {
    function Example() {
      const [value, setValue] = useState('');
      return (
        <Table
          caption="Language preferences"
          columns={[
            {
              id: 'language',
              label: 'Language',
              cell: () => (
                <Select label="Language" options={options} value={value} onChange={setValue} />
              ),
            },
          ]}
          rows={[{ id: 'preference' }]}
          getRowKey={(row) => row.id}
        />
      );
    }
    return <Example />;
  },
};
