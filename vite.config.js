import { defineConfig } from 'vite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  root: path.resolve(__dirname, 'client'),
  build: {
    outDir: '../public',
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'client'),
    },
  },
});