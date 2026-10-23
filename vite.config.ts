import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(() => {
  return {
    base: './',
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: [
          'icon.svg',
          'apple-touch-icon.png',
          'pwa-192x192.png',
          'pwa-512x512.png',
          'pwa-maskable-512x512.png',
          'screenshot-mobile.png',
          'screenshot-desktop.png',
          'campus-qr-poster.html',
        ],
        manifest: {
          id: '/',
          name: 'Tahan — Verified Student Housing & Utility Transparency',
          short_name: 'Tahan',
          description:
            'Discover verified student boarding houses and dormitories with transparent electricity rates, BFP fire safety clearances, and flood profiles.',
          dir: 'ltr',
          lang: 'en-PH',
          theme_color: '#0F172A',
          background_color: '#FAF8F5',
          display: 'standalone',
          display_override: ['window-controls-overlay', 'standalone', 'minimal-ui'],
          orientation: 'portrait-primary',
          start_url: '/',
          scope: '/',
          categories: ['lifestyle', 'education', 'utilities'],
          shortcuts: [
            {
              name: 'Discover Rooms',
              short_name: 'Discover',
              description: 'Browse verified student boarding houses near campus',
              url: '/?tab=explore',
              icons: [{ src: '/pwa-192x192.png', sizes: '192x192' }],
            },
            {
              name: 'Utility Bill Planner',
              short_name: 'Bill Planner',
              description: 'Compute true monthly rent + grid electricity load',
              url: '/?tab=calculator',
              icons: [{ src: '/pwa-192x192.png', sizes: '192x192' }],
            },
            {
              name: 'Campus Map',
              short_name: 'Map',
              description: 'Inspect 500m campus walking rings and flood elevation',
              url: '/?tab=map',
              icons: [{ src: '/pwa-192x192.png', sizes: '192x192' }],
            },
          ],
          icons: [
            {
              src: '/pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-maskable-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
          screenshots: [
            {
              src: '/screenshot-mobile.png',
              sizes: '540x720',
              type: 'image/png',
              form_factor: 'narrow',
              label: 'Tahan Mobile Room Discovery',
            },
            {
              src: '/screenshot-desktop.png',
              sizes: '1280x720',
              type: 'image/png',
              form_factor: 'wide',
              label: 'Tahan Campus Map and Utility Bill Planner',
            },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'gstatic-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /^https:\/\/[abc]\.tile\.openstreetmap\.org\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'tahan-osm-tiles-cache',
                expiration: {
                  maxEntries: 350,
                  maxAgeSeconds: 60 * 60 * 24 * 30,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /^https:\/\/.*\.supabase\.co\/rest\/v1\/.*/i,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'supabase-api-offline-cache',
                networkTimeoutSeconds: 4,
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 60 * 60 * 24 * 14,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
          ],
        },
        devOptions: {
          enabled: true,
          type: 'module',
        },
      }),
    ],
    build: {
      target: 'es2020',
      sourcemap: false,
      chunkSizeWarningLimit: 600,
      rollupOptions: {
        output: {
          manualChunks(id: string) {
            if (id.includes('node_modules/leaflet')) {
              return 'leaflet-gis';
            }
            if (id.includes('node_modules/lucide-react')) {
              return 'ui-icons';
            }
            if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
              return 'react-vendor';
            }
          },
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
