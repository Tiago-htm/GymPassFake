import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths()],

  test: {
    coverage: {
      provider: 'v8', // ou 'istanbul' se preferir
      reporter: ['text', 'html'],
      reportsDirectory: './coverage',
      exclude: ['**/node_modules/**', '**/prisma/**', '**/generated/**'],
    },
  },
})
