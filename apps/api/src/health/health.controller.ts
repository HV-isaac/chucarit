import { Controller, Get, Inject, ServiceUnavailableException } from '@nestjs/common';
import { sql } from 'drizzle-orm';

import { DATABASE, type Database } from '../db/db.module.js';

export interface HealthStatus {
  status: 'ok';
  database: 'up';
}

@Controller('health')
export class HealthController {
  constructor(@Inject(DATABASE) private readonly db: Database) {}

  /** Liveness and database check (PostGIS included) for Caddy and the deploy script. */
  @Get()
  async check(): Promise<HealthStatus> {
    try {
      await this.db.execute(sql`select postgis_version()`);
    } catch {
      throw new ServiceUnavailableException('Servicio no disponible');
    }
    return { status: 'ok', database: 'up' };
  }
}
