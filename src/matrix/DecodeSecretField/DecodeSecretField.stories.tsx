import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { ThemePair } from '../../../.storybook/ThemePair';
import { withMatrix } from '../../../.storybook/withMatrix';
import { DecodeSecretField } from './DecodeSecretField';

function Field() {
  const [value, setValue] = useState('hvs.CAESIJ3x9QmZkT2pL');
  return <DecodeSecretField label="Root token" value={value} onChange={setValue} />;
}

const meta = {
  title: 'Matrix/DecodeSecretField',
  component: DecodeSecretField,
  decorators: [withMatrix],
  args: { label: 'Root token', value: 'hvs.CAESIJ3x9QmZkT2pL', onChange: () => {} },
} satisfies Meta<typeof DecodeSecretField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { render: () => <Field /> };

export const Disabled: Story = { args: { disabled: true } };

export const Themes: Story = {
  render: () => <ThemePair>{() => <Field />}</ThemePair>,
};
