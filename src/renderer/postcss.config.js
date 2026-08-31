import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Called directly (array form) with an absolute path, rather than the
// `plugins: { tailwindcss: {...} }` shorthand: that shorthand passes
// whatever object you give it straight through as tailwindcss's
// `configOrPath` argument, so `{ config: '...' }` is treated as a literal
// (near-empty) Tailwind config rather than "load the file at this path" —
// silently dropping our theme (brand colors, content globs).
export default {
  plugins: [tailwindcss(join(__dirname, 'tailwind.config.cjs')), autoprefixer()],
};
