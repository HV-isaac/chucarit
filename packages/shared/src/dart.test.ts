import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

import { DART_OUTPUT_PATH, renderDart } from '../scripts/dart.ts';
import * as shared from './index.js';

const domain = {
  reportStatuses: shared.REPORT_STATUSES,
  reportStatusLabels: shared.REPORT_STATUS_LABELS,
  finalReportStatuses: shared.FINAL_REPORT_STATUSES,
  openReportStatuses: shared.OPEN_REPORT_STATUSES,
  roles: shared.ROLES,
  roleLabels: shared.ROLE_LABELS,
  staffRoles: shared.STAFF_ROLES,
  reportTransitions: shared.REPORT_TRANSITIONS,
};

describe('Dart domain for apps/mobile', () => {
  it('is up to date with packages/shared (run `pnpm --filter @chucarit/shared gen:dart`)', () => {
    const committed = readFileSync(
      resolve(import.meta.dirname, '../../..', DART_OUTPUT_PATH),
      'utf8',
    );
    expect(committed).toBe(renderDart(domain));
  });

  it('keeps API values and converts them to Dart identifiers', () => {
    const dart = renderDart(domain);
    expect(dart).toContain("inProgress('in_progress', 'En atención'),");
    expect(dart).toContain('ReportStatus.received: {');
  });

  it('escapes quotes and interpolation in labels', () => {
    const dart = renderDart({
      ...domain,
      reportStatusLabels: { ...domain.reportStatusLabels, received: "It's $ok" },
    });
    expect(dart).toContain("received('received', 'It\\'s \\$ok'),");
  });
});
