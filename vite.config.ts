import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react({
      jsxImportSource: '@emotion/react',
    }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'es2020',
    minify: 'esbuild',
    sourcemap: false,
    reportCompressedSize: false,
    cssCodeSplit: true,
    modulePreload: {
      resolveDependencies: (_url, deps, context) => {
        if (context.hostType !== 'html') {
          return deps;
        }

        return deps.filter(
          (dep) => !dep.startsWith('/assets/charts-') && !dep.startsWith('/assets/xlsx-'),
        );
      },
    },
    commonjsOptions: {
      ignoreDynamicRequires: true,
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          const normalizedId = id.split(path.sep).join('/');

          if (!normalizedId.includes('/node_modules/')) {
            return;
          }

          if (normalizedId.includes('/node_modules/xlsx/')) {
            return 'xlsx';
          }

          if (
            normalizedId.includes('/node_modules/react/') ||
            normalizedId.includes('/node_modules/react-dom/') ||
            normalizedId.includes('/node_modules/scheduler/')
          ) {
            return 'react-vendor';
          }

          if (
            normalizedId.includes('/node_modules/recharts/')
          ) {
            return 'charts';
          }

          if (normalizedId.includes('/node_modules/victory-vendor/')) {
            return 'charts-vendor';
          }

          if (normalizedId.includes('/node_modules/@supabase/')) {
            return 'supabase';
          }

          if (normalizedId.includes('/node_modules/motion/')) {
            return 'motion';
          }

          if (normalizedId.includes('/node_modules/react-router/')) {
            return 'router';
          }
        },
      },
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
})
