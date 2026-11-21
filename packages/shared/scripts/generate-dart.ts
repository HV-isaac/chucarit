// Writes (or with --check, verifies) the Dart version of the shared domain for apps/mobile.
// Runs on the built package: `pnpm --filter @chucarit/shared gen:dart`.
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

import * as shared from '../dist/index.js';
import { DART_OUTPUT_PATH, renderDart } from './dart.ts';

const repoRoot = resolve(import.meta.dirname, '../../..');
const outputPath = resolve(repoRoot, DART_OUTPUT_PATH);

const source = renderDart({
  reportStatuses: shared.REPORT_STATUSES,
  reportStatusLabels: shared.REPORT_STATUS_LABELS,
  finalReportStatuses: shared.FINAL_REPORT_STATUSES,
  openReportStatuses: shared.OPEN_REPORT_STATUSES,
  roles: shared.ROLES,
  roleLabels: shared.ROLE_LABELS,
  staffRoles: shared.STAFF_ROLES,
  reportTransitions: shared.REPORT_TRANSITIONS,
});

if (process.argv.includes('--check')) {
  let current = '';
  try {
    current = readFileSync(outputPath, 'utf8');
  } catch {
    // Missing file is reported below as out of date.
  }
  if (current !== source) {
    console.error(
      `${DART_OUTPUT_PATH} is out of date. Run: pnpm --filter @chucarit/shared gen:dart`,
    );
    process.exit(1);
  }
  console.log(`${DART_OUTPUT_PATH} is up to date.`);
} else {
  writeFileSync(outputPath, source);
  console.log(`Wrote ${DART_OUTPUT_PATH}`);
}
