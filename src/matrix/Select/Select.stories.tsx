import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { ThemePair } from '../../../.storybook/ThemePair';
import { withMatrix } from '../../../.storybook/withMatrix';
import { Select } from './Select';

const options = [
  { value: 'token', label: 'Token', code: 'TOKEN', hint: 'Paste a vault token.' },
  { value: 'oidc', label: 'OIDC', hint: 'Sign in with your identity provider.' },
  { value: 'ldap', label: 'LDAP', hint: 'Use your directory credentials.' },
];

function Demo({ clearable = false }: { clearable?: boolean }) {
  const [value, setValue] = useState('');
  return (
    <div style={{ minHeight: '16rem' }}>
      <Select
        label="Auth method"
        options={options}
        value={value}
        onChange={setValue}
        clearable={clearable}
      />
    </div>
  );
}

const meta = {
  title: 'Matrix/Select',
  component: Select,
  decorators: [withMatrix],
  args: { label: 'Auth method', options, value: '', onChange: () => {} },
  render: () => <Demo />,
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Clearable: Story = { render: () => <Demo clearable /> };

export const Themes: Story = {
  render: () => <ThemePair>{() => <Demo />}</ThemePair>,
};
