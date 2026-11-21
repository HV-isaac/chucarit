import { existsSync } from 'node:fs';

import { defineConfig } from 'vitest/config';

if (existsSync('.env')) process.loadEnvFile('.env');

export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    globals: true,
    root: './',
    include: ['test/**/*.e2e-spec.ts'],
    // e2e suites always run against the test database, never the development one.
    env: {
      NODE_ENV: 'test',
      DATABASE_URL:
        process.env.TEST_DATABASE_URL ??
        'postgres://chucarit:chucarit@127.0.0.1:5437/chucarit_test',
    },
    fileParallelism: false,
  },
});
