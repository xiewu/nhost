import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env.test') });

export default defineConfig({
  testDir: './e2e',
  timeout: 60 * 1000,
  expect: {
    timeout: 10000,
  },
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: 'html',
  use: {
    actionTimeout: 0,
    trace: 'retain-on-failure',
    baseURL: process.env.NHOST_TEST_DASHBOARD_URL,
    launchOptions: {
      slowMo: 500,
    },
  },
  projects: [
    {
      name: 'setup',
      testMatch: ['**/setup/*.setup.ts'],
      teardown: 'teardown',
    },
    {
      name: 'teardown',
      testMatch: ['**/teardown/*.teardown.ts'],
    },
    {
      name: 'main',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'e2e/.auth/user.json',
      },
      dependencies: ['setup'],
      testIgnore: ['upgrade-project.test.ts', 'cli-local-dashboard.test.ts'],
    },
    {
      name: 'local',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: '', // Local dashboard URL
      },
      testMatch: 'cli-local-dashboard.test.ts',
    },
    {
      name: 'upgrade-project',
      testMatch: 'upgrade-project.test.ts',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
  ],
});
