import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { ThemePair } from '../../../.storybook/ThemePair';
import { withMatrix } from '../../../.storybook/withMatrix';
import { TerminalSelect } from './TerminalSelect';

const options = [
  { value: 'token', label: 'Token', code: 'TOKEN', hint: 'Paste a vault token.' },
  { value: 'oidc', label: 'OIDC', code: 'OIDC', hint: 'Sign in with your identity provider.' },
  { value: 'ldap', label: 'LDAP', code: 'LDAP', hint: 'Use your directory credentials.' },
  { value: 'userpass', label: 'Username', code: 'USERPASS', hint: 'Username and password.' },
];

function Select({ clearable = false }: { clearable?: boolean }) {
  const [value, setValue] = useState('oidc');
  return (
    <TerminalSelect
      label="Auth method"
      prefix="auth://"
      options={options}
      value={value}
      onChange={setValue}
      clearable={clearable}
    />
  );
}

const meta = {
  title: 'Matrix/TerminalSelect',
  component: TerminalSelect,
  decorators: [withMatrix],
  args: { label: 'Auth method', options, value: 'oidc', onChange: () => {} },
} satisfies Meta<typeof TerminalSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { render: () => <Select /> };

export const Clearable: Story = { render: () => <Select clearable /> };

export const Disabled: Story = { args: { disabled: true } };

export const Themes: Story = {
  render: () => <ThemePair>{() => <Select />}</ThemePair>,
};
