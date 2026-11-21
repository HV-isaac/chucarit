import { Global, Inject, Module, type OnApplicationShutdown } from '@nestjs/common';
import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres';
import pg from 'pg';

import { env } from '../config/env.js';
import * as schema from './schema/index.js';

export type Database = NodePgDatabase<typeof schema>;

export const PG_POOL = Symbol('PG_POOL');
export const DATABASE = Symbol('DATABASE');

@Global()
@Module({
  providers: [
    {
      provide: PG_POOL,
      useFactory: () => new pg.Pool({ connectionString: env().DATABASE_URL, max: 10 }),
    },
    {
      provide: DATABASE,
      inject: [PG_POOL],
      useFactory: (pool: pg.Pool): Database => drizzle({ client: pool, schema }),
    },
  ],
  exports: [DATABASE],
})
export class DbModule implements OnApplicationShutdown {
  constructor(@Inject(PG_POOL) private readonly pool: pg.Pool) {}

  async onApplicationShutdown(): Promise<void> {
    await this.pool.end();
  }
}
