/// <reference types="vite/client" />
import type { Decorator } from '@storybook/react-vite';
import drawnCss from '../src/styles/drawn.css?inline';

// Mounted per story so drawn tokens and styles never leak into the default component stories.
export const withDrawn: Decorator = (Story) => (
  <>
    <style>{drawnCss}</style>
    <Story />
  </>
);
