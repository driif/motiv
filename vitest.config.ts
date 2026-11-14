import react from '@vitejs/plugin-react';
import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    exclude: [...configDefaults.exclude, '.claude/worktrees/**'],
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    // Raw CSS is read by the token, contrast and scale guards; vitest blanks excluded CSS.
    css: { include: [/\.css/] },
    benchmark: { include: ['test/benchmarks/**/*.bench.tsx'] },
  },
});
