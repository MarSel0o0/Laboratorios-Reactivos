import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  // Los tests comparten una única base de datos, así que corren de a uno.
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // Chromium del sistema: Playwright no soporta --with-deps en Arch.
        launchOptions: { executablePath: '/usr/bin/chromium' },
      },
    },
  ],

  webServer: [
    {
      // NODE_ENV=test: el backend usa la base de datos de pruebas (MONGODB_DBNAME_TEST).
      command: 'npm run start:test',
      cwd: '../backend',
      url: 'http://localhost:3001/api/threads',
      reuseExistingServer: true,
    },
    {
      command: 'npm run dev',
      cwd: '../frontend',
      url: 'http://localhost:5173',
      reuseExistingServer: true,
    },
  ],
});
