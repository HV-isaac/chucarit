import { ServiceUnavailableException } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { DATABASE } from '../db/db.module.js';
import { HealthController } from './health.controller.js';

async function createController(execute: () => Promise<unknown>) {
  const moduleRef = await Test.createTestingModule({
    controllers: [HealthController],
    providers: [{ provide: DATABASE, useValue: { execute } }],
  }).compile();
  return moduleRef.get(HealthController);
}

describe('HealthController', () => {
  it('reports ok when the database answers', async () => {
    const controller = await createController(vi.fn().mockResolvedValue({ rows: [] }));
    await expect(controller.check()).resolves.toEqual({ status: 'ok', database: 'up' });
  });

  it('answers 503 without internal details when the database is down', async () => {
    const controller = await createController(
      vi.fn().mockRejectedValue(new Error('connect ECONNREFUSED 127.0.0.1:5437')),
    );
    const error = await controller.check().catch((e: unknown) => e);
    expect(error).toBeInstanceOf(ServiceUnavailableException);
    expect((error as Error).message).not.toContain('ECONNREFUSED');
  });
});
