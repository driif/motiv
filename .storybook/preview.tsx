import type { Decorator, Preview } from '@storybook/react-vite';
import '../src/styles/index.css';
import '../src/styles/base.css';

const withTheme: Decorator = (Story, context) => {
  const theme = context.globals.theme as string;
  if (theme === 'system') delete document.documentElement.dataset.theme;
  else document.documentElement.dataset.theme = theme;
  return <Story />;
};

const preview: Preview = {
  tags: ['autodocs'],
  decorators: [withTheme],
  globalTypes: {
    theme: {
      description: 'Color theme',
      toolbar: {
        icon: 'mirror',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
          { value: 'system', title: 'System' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: 'light' },
};

export default preview;
