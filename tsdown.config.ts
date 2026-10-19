import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts', 'src/drawn/index.ts'],
  format: 'esm',
  platform: 'neutral',
  unbundle: true,
  dts: true,
  fixedExtension: false,
});
