import { describe, expect, it } from 'vitest';

import { FINAL_REPORT_STATUSES, OPEN_REPORT_STATUSES, REPORT_STATUSES } from './report-status.js';
import { allowedTransitions, canTransition, REPORT_TRANSITIONS } from './report-transitions.js';
import { ROLES } from './roles.js';

describe('REPORT_TRANSITIONS', () => {
  it('defines an entry for every status', () => {
    expect(Object.keys(REPORT_TRANSITIONS).sort()).toEqual([...REPORT_STATUSES].sort());
  });

  it('never leaves a final status', () => {
    for (const status of FINAL_REPORT_STATUSES) {
      for (const role of ROLES) {
        expect(allowedTransitions(status, role)).toEqual([]);
      }
    }
  });

  it('never lets a citizen change a status', () => {
    for (const from of REPORT_STATUSES) {
      expect(allowedTransitions(from, 'citizen')).toEqual([]);
    }
  });

  it('only targets known statuses and never the same status', () => {
    for (const [from, targets] of Object.entries(REPORT_TRANSITIONS)) {
      for (const to of Object.keys(targets)) {
        expect(REPORT_STATUSES).toContain(to);
        expect(to).not.toBe(from);
      }
    }
  });
});

describe('canTransition', () => {
  it.each([
    ['received', 'validated', 'moderator'],
    ['received', 'rejected', 'moderator'],
    ['received', 'duplicate', 'admin'],
    ['validated', 'assigned', 'moderator'],
    ['assigned', 'in_progress', 'responder'],
    ['in_progress', 'resolved', 'responder'],
  ] as const)('allows %s → %s for %s', (from, to, role) => {
    expect(canTransition(from, to, role)).toBe(true);
  });

  it.each([
    ['received', 'validated', 'citizen'],
    ['received', 'validated', 'responder'],
    ['received', 'resolved', 'admin'],
    ['assigned', 'in_progress', 'moderator'],
    ['resolved', 'received', 'admin'],
  ] as const)('rejects %s → %s for %s', (from, to, role) => {
    expect(canTransition(from, to, role)).toBe(false);
  });
});

describe('OPEN_REPORT_STATUSES', () => {
  it('contains every non-final status', () => {
    expect(OPEN_REPORT_STATUSES).toEqual(['received', 'validated', 'assigned', 'in_progress']);
  });
});
