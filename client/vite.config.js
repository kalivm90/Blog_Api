import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';

const env = loadEnv(process.env.NODE_ENV || 'development', process.cwd());

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@styles": path.resolve(__dirname, "./src/assets/styles"),
      "@images": path.resolve(__dirname, "./src/assets/images"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@pages": path.resolve(__dirname, "./src/pages"),
      "@util": path.resolve(__dirname, "./src/util"),
    },
  },
  plugins: [react()],
  define: {
    // main server domain
    "process.env.VITE_SERVER_DOMAIN": JSON.stringify(env.VITE_SERVER_DOMAIN),
    // server auth path
    "process.env.VITE_SERVER_AUTH": JSON.stringify(env.VITE_SERVER_AUTH),
    // api version and api server path 
    "process.env.VITE_SERVER_VERSION": JSON.stringify(env.VITE_SERVER_VERSION),
    "process.env.VITE_SERVER_PATH": JSON.stringify(env.VITE_SERVER_PATH),
  }
})