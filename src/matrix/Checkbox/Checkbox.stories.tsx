import type { Meta, StoryObj } from '@storybook/react-vite';
import { ThemePair } from '../../../.storybook/ThemePair';
import { withMatrix } from '../../../.storybook/withMatrix';
import { Checkbox } from './Checkbox';

const meta = {
  title: 'Matrix/Checkbox',
  component: Checkbox,
  decorators: [withMatrix],
  args: { label: 'Send me the newsletter' },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Checked: Story = { args: { defaultChecked: true } };

export const Disabled: Story = { args: { disabled: true, defaultChecked: true } };

export const Themes: Story = {
  render: (args) => (
    <ThemePair>
      {() => (
        <>
          <Checkbox {...args} />
          <Checkbox label="Already checked" defaultChecked />
        </>
      )}
    </ThemePair>
  ),
};
