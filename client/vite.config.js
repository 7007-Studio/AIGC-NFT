import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv';

export default defineConfig(({ mode }) => {
  dotenv.config({ mode });

  return {
    plugins: [react()],
    server: {
      port: 3000,
      proxy: {
        "/api/v1/dalle": {
          target: "http://localhost:5555",
          changeOrigin: true,
          secure: false,
        },
      },
    },
  }
});
