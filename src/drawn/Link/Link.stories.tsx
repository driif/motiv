import type { Meta, StoryObj } from '@storybook/react-vite';
import { ThemePair } from '../../../.storybook/ThemePair';
import { withDrawn } from '../../../.storybook/withDrawn';
import { Link } from './Link';

const meta = {
  title: 'Drawn/Link',
  component: Link,
  decorators: [withDrawn],
  args: { href: '#top', children: 'Read the guide' },
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const External: Story = { args: { href: 'https://example.com', external: true } };

export const WithoutArrow: Story = { args: { arrow: false } };

export const Themes: Story = {
  render: (args) => <ThemePair>{() => <Link {...args} />}</ThemePair>,
};
