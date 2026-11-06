import type { Meta, StoryObj } from '@storybook/react-vite';
import { type CSSProperties, useState } from 'react';
import { ThemePair } from '../../../.storybook/ThemePair';
import { withMatrix } from '../../../.storybook/withMatrix';
import type { MultiSelectProps } from '../../components/MultiSelect';
import { MultiSelect } from './MultiSelect';

const options = [
  { value: 'read', label: 'Read entries', hint: 'View submitted forms' },
  { value: 'write', label: 'Edit entries', hint: 'Update existing forms' },
  { value: 'publish', label: 'Publish forms' },
  { value: 'archive', label: 'Archive entries' },
  { value: 'delete', label: 'Delete entries' },
];

function Demo({ value: initial = [], ...props }: Partial<MultiSelectProps>) {
  const [value, setValue] = useState(initial);
  return (
    <MultiSelect
      label="Permissions"
      options={options}
      value={value}
      onChange={setValue}
      {...props}
    />
  );
}

const meta: Meta<typeof MultiSelect> = {
  title: 'Matrix/MultiSelect',
  component: MultiSelect,
  args: { label: 'Permissions', options, value: [], onChange: () => {} },
  decorators: [
    withMatrix,
    (Story) => (
      <div style={{ width: '100%', maxWidth: '26rem', minHeight: '28rem' }}>
        <Story />
      </div>
    ),
  ],
  render: (args) => <Demo {...args} />,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ThreeHundredOptions: Story = {
  args: {
    options: Array.from({ length: 300 }, (_, i) => ({
      value: `permission-${i}`,
      label: `Permission ${i + 1}`,
      hint: `Group ${Math.floor(i / 10) + 1}`,
    })),
  },
};

export const LongLabels: Story = {
  args: {
    options: [
      {
        value: 'read',
        label: 'Read all submitted forms across every workspace in the organization',
        hint: 'Includes archived entries and attachments from previous reporting periods',
      },
      { value: 'write', label: 'EditAllSubmittedFormsAcrossEveryWorkspaceInTheOrganization' },
    ],
    value: ['read', 'write'],
  },
};

export const ManySelected: Story = { args: { value: options.map((option) => option.value) } };

export const OverflowHidden: Story = {
  render: () => (
    <div style={{ overflow: 'hidden', height: '8rem', padding: '1rem' }}>
      <Demo />
    </div>
  ),
};

export const Disabled: Story = { args: { disabled: true, value: ['read', 'write'] } };

export const Empty: Story = { args: { options: [] } };

export const Themes: Story = {
  render: () => <ThemePair>{() => <Demo value={['read', 'write']} />}</ThemePair>,
};

export const Rethemed: Story = {
  render: () => (
    <div
      style={
        {
          '--motiv-select-accent': '#2563eb',
          '--motiv-select-radius': '0.25rem',
          '--motiv-select-bg': '#eff6ff',
          '--motiv-select-color': '#172554',
          '--motiv-select-border-color': '#2563eb',
        } as CSSProperties
      }
    >
      <Demo value={['read']} />
    </div>
  ),
};
