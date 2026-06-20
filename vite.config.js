import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'react-vendor'
          }
          if (id.includes('node_modules/three') || id.includes('node_modules/@react-three/fiber') || id.includes('node_modules/@react-three/drei')) {
            return 'three-vendor'
          }
          if (id.includes('node_modules/@react-three/postprocessing') || id.includes('node_modules/postprocessing')) {
            return 'postprocessing-vendor'
          }
          if (id.includes('node_modules/gsap') || id.includes('node_modules/framer-motion')) {
            return 'animation-vendor'
          }
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    sourcemap: false
  },
  optimizeDeps: {
    include: ['three', '@react-three/fiber', '@react-three/drei']
  },
  server: {
    port: 5173,
    open: true
  }
})
