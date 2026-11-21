import { existsSync } from 'node:fs';

import { defineConfig } from 'drizzle-kit';

if (existsSync('.env')) process.loadEnvFile('.env');

const url = process.env.DATABASE_URL;
if (!url) throw new Error('DATABASE_URL is not set (see apps/api/.env.example)');

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/db/schema/index.ts',
  out: './drizzle',
  dbCredentials: { url },
  strict: true,
  verbose: true,
});
