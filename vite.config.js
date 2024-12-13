import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Favicon isteğini yok say
    headers: {
      'Cache-Control': 'no-store',
    },
  }
});
