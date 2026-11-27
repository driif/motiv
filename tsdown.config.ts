import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/drawn/index.ts',
    'src/matrix/index.ts',
    'src/action-menu/index.ts',
    'src/markdown/index.ts',
    'src/data-table/index.ts',
    'src/drawn/action-menu/index.ts',
    'src/drawn/markdown/index.ts',
    'src/drawn/data-table/index.ts',
    'src/matrix/action-menu/index.ts',
    'src/matrix/markdown/index.ts',
    'src/matrix/data-table/index.ts',
  ],
  format: 'esm',
  platform: 'neutral',
  unbundle: true,
  dts: true,
  fixedExtension: false,
});
