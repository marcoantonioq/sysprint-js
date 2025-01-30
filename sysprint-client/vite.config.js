import { defineConfig } from '@quasar/app-vite/wrappers'

export default defineConfig({
  server: {
    allowedHosts: ['print.goias.ifg.edu.br'],
  },
})
