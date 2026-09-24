import { defineConfig } from '@playwright/test'
export default defineConfig({
  testDir: './tests',
  use: { baseURL: 'http://localhost:8443', headless: true },
  webServer: [
    { command: 'npm run dev', url: 'http://localhost:8443', reuseExistingServer: true },
    { command: 'npm run dev:backend', url: 'http://localhost:3001/api/health', reuseExistingServer: true },
  ],
})
