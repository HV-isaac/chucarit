import { existsSync } from 'node:fs';

import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module.js';
import { env } from './config/env.js';

if (existsSync('.env')) process.loadEnvFile('.env');

async function bootstrap() {
  const { PORT } = env();
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();
  await app.listen(PORT);
}
await bootstrap();
