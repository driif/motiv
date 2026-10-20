/// <reference types="vite/client" />
import type { Decorator } from '@storybook/react-vite';
import matrixCss from '../src/styles/matrix.css?inline';

// Mounted per story so matrix tokens and styles never leak into the other stories.
export const withMatrix: Decorator = (Story) => (
  <>
    <style>{matrixCss}</style>
    <Story />
  </>
);
