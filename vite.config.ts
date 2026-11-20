import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

declare module 'vite' {
  interface ESBuildOptions {
    drop?: ('console' | 'debugger')[];
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    {
      name: 'serve-desarrollo-static-index',
      configureServer(server) {
        server.middlewares.use((req, _res, next) => {
          if (req.url === '/desarrollo' || req.url === '/desarrollo/') {
            req.url = '/desarrollo/index.html';
          }
          next();
        });
      },
    },
  ],
  esbuild: {
    drop: ['console', 'debugger'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (
              id.includes('/react/') ||
              id.includes('/react-dom/') ||
              id.includes('/react-router/') ||
              id.includes('/react-router-dom/')
            ) {
              return 'vendor-react';
            }
            if (id.includes('/motion/') || id.includes('/framer-motion/')) {
              return 'vendor-motion';
            }
            if (
              id.includes('/lenis/') ||
              id.includes('/lucide-react/') ||
              id.includes('/clsx/') ||
              id.includes('/tailwind-merge/')
            ) {
              return 'vendor-utils';
            }
          }
        },
      },
    },
  },
})
