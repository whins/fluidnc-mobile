import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import { fileURLToPath } from 'url'
import tailwindcss from '@tailwindcss/vite'
import ui from '@nuxt/ui/vite'

export default defineConfig({
  // server: {
  //   hmr: {
  //     host: 'localhost', // Or your specific host/IP
  //   },
  //   // Consider setting the main host to 0.0.0.0 if in a container
  //   host: '0.0.0.0'
  // },
  plugins: [
    tailwindcss(),
    vue(),
    ui(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'FluidNC Mobile',
        short_name: 'FluidNC',
        theme_color: '#111827',
        background_color: '#111827',
        display: 'standalone',
        orientation: 'landscape',
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
