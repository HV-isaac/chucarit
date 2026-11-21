import type { ReportStatus } from './report-status.js';
import type { Role } from './roles.js';

/**
 * Single source of truth for which status changes are allowed and who may make them.
 * The API validates every transition against this table; clients only use it to decide
 * which actions to show.
 *
 * Initial version taken from CLAUDE.md. The first Spec Kit feature (report lifecycle)
 * refines it, e.g. citizen cancellation while a report is `received`.
 */
export const REPORT_TRANSITIONS: Readonly<
  Record<ReportStatus, Partial<Record<ReportStatus, readonly Role[]>>>
> = {
  received: {
    validated: ['moderator', 'admin'],
    rejected: ['moderator', 'admin'],
    duplicate: ['moderator', 'admin'],
  },
  validated: {
    assigned: ['moderator', 'admin'],
  },
  assigned: {
    in_progress: ['responder', 'admin'],
  },
  in_progress: {
    resolved: ['responder', 'admin'],
  },
  resolved: {},
  rejected: {},
  duplicate: {},
};

/** Whether `role` may move a report from `from` to `to`. */
export function canTransition(from: ReportStatus, to: ReportStatus, role: Role): boolean {
  return REPORT_TRANSITIONS[from][to]?.includes(role) ?? false;
}

/** Statuses `role` may move a report to from `from`, in table order. */
export function allowedTransitions(from: ReportStatus, role: Role): ReportStatus[] {
  return (Object.entries(REPORT_TRANSITIONS[from]) as [ReportStatus, readonly Role[]][])
    .filter(([, roles]) => roles.includes(role))
    .map(([to]) => to);
}
