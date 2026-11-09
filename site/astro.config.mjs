import react from '@astrojs/react';
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://motiv.fedorchuk.me',
  integrations: [react()],
  vite: {
    build: {
      rolldownOptions: {
        output: {
          codeSplitting: {
            groups: [{ name: 'markdown-html-parser', test: /node_modules\/parse5\// }],
          },
        },
      },
    },
  },
});
