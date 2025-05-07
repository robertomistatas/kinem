import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/kinem/', // Base URL para GitHub Pages
  build: {
    outDir: 'dist', // Directorio de salida para la compilación
    assetsDir: 'assets', // Directorio para assets estáticos
    sourcemap: true, // Habilitar sourcemaps para debugging
  },
  server: {
    port: 3000, // Puerto para desarrollo local
    open: true, // Abrir navegador automáticamente
  }
})