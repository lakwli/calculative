import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,  // This allows Vite to listen on all addresses, necessary for Docker
    port: 3000,  // Set the port to 3000
    strictPort: true
  }
})