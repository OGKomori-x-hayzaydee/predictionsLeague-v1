import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon-16x16.png', 'apple-touch-icon.png'],
      manifest: {
        name: 'predictionsLeague',
        short_name: 'predictionsLeague',
        description: 'The ultimate Premier League prediction game',
        theme_color: '#050914',
        background_color: '#050914',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
})
