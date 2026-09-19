import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

// Builds the interactive demo windows into one self-contained file: public/demos/index.html.
// Run `npm run build:demos` after editing anything under demos/.
export default defineConfig({
  root: 'demos',
  base: './',
  plugins: [react(), viteSingleFile()],
  build: { outDir: '../public/demos', emptyOutDir: true },
});
