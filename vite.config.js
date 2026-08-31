import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
  build: {
    // Left undeclared, the toolchain picks a floor old enough to need helpers
    // for syntax every browser this site sees has had for years, and ships them
    // to all of them. These four are the oldest engines with full support for
    // the output Vite emits at this level.
    target: ['chrome107', 'edge107', 'firefox104', 'safari16'],
    rollupOptions: {
      output: {
        // React and the router move on a release cadence; the pages move on
        // every copy edit. Hashing them apart means a returning visitor
        // re-downloads the page that changed instead of the framework under it.
        // The icon set is deliberately left out: it is tree-shaken per route,
        // and pulling it in here would put every icon the site uses into the
        // chunk the first screen waits for.
        manualChunks: (id) => (id.includes('node_modules/react') ? 'framework' : undefined),
      },
    },
  },
});
