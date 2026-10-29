import { defineConfig } from 'vite';
import pkg from './package.json' with { type: 'json' };

// One IIFE bundle, served from jsDelivr at a tagged release:
//   https://cdn.jsdelivr.net/gh/<owner>/plusminus-site@vX.Y.Z/dist/pm.js
// GSAP and its plugins are NOT bundled: they come from Webflow's built-in GSAP
// (or a pinned CDN tag) and are read from window.gsap at runtime.
export default defineConfig({
  build: {
    lib: {
      entry: 'src/main.js',
      name: 'PM',
      formats: ['iife'],
      fileName: () => 'pm.js',
    },
    target: 'es2019',
    sourcemap: true,
    emptyOutDir: true,
  },
  define: { __PM_VERSION__: JSON.stringify(pkg.version) },
  server: { port: 5173, cors: true },
});
