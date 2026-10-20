import type { Meta, StoryObj } from '@storybook/react-vite';
import type { CSSProperties } from 'react';
import { ThemePair } from '../../../.storybook/ThemePair';
import { withDrawn } from '../../../.storybook/withDrawn';
import { Button, buttonClassName } from './Button';

const variants = ['primary', 'secondary', 'outline', 'ghost', 'danger'] as const;
const sizes = ['sm', 'md', 'lg'] as const;

const row: CSSProperties = {
  display: 'flex',
  gap: '0.75rem',
  alignItems: 'center',
  flexWrap: 'wrap',
};

const meta = {
  title: 'Drawn/Button',
  component: Button,
  decorators: [withDrawn],
  args: { children: 'Save' },
  argTypes: {
    variant: { control: 'inline-radio', options: variants },
    size: { control: 'inline-radio', options: sizes },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const VariantsAndSizes: Story = {
  render: () => (
    <ThemePair>
      {() =>
        variants.map((variant) => (
          <div key={variant} style={row}>
            {sizes.map((size) => (
              <Button key={size} variant={variant} size={size}>
                {variant} {size}
              </Button>
            ))}
          </div>
        ))
      }
    </ThemePair>
  ),
};

export const LoadingAndDisabled: Story = {
  render: () => (
    <ThemePair>
      {() =>
        variants.map((variant) => (
          <div key={variant} style={row}>
            <Button variant={variant} loading>
              Saving
            </Button>
            <Button variant={variant} disabled>
              Disabled
            </Button>
          </div>
        ))
      }
    </ThemePair>
  ),
};

export const AsLink: Story = {
  render: () => (
    <a href="#top" className={buttonClassName({ variant: 'outline' })}>
      Link styled as a button
    </a>
  ),
};
