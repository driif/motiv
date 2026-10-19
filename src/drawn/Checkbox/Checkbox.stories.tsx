import type { Meta, StoryObj } from '@storybook/react-vite';
import { ThemePair } from '../../../.storybook/ThemePair';
import { withDrawn } from '../../../.storybook/withDrawn';
import { Checkbox } from './Checkbox';

const meta = {
  title: 'Drawn/Checkbox',
  component: Checkbox,
  decorators: [withDrawn],
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
