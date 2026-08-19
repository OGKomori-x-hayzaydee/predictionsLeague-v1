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
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'predictionsLeague',
        short_name: 'predictionsLeague',
        description: 'The ultimate Premier League prediction game',
        theme_color: '#050914',
        background_color: '#050914',
        icons: []
      }
    })
  ],
})
