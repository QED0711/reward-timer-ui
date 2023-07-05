import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs';
import path from 'path';

const privateKey = fs.readFileSync(path.resolve(__dirname, "ssl", "server.key"), 'utf8');
const certificate = fs.readFileSync(path.resolve(__dirname, "ssl", "server.cert"), 'utf8');

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    https: {
      key: privateKey,
      cert: certificate
    },
  },
  plugins: [react()],
})
