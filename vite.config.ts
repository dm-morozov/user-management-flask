import { defineConfig } from 'vite'

export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/user-management-flask/' : '/',
  server: {
    host: '127.0.0.1',
    port: 5173,
  },
}))
