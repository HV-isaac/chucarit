import { z } from 'zod';

/**
 * Lifecycle of a report:
 *
 *   received → validated → assigned → in_progress → resolved
 *       ↘ rejected / duplicate
 */
export const REPORT_STATUSES = [
  'received',
  'validated',
  'assigned',
  'in_progress',
  'resolved',
  'rejected',
  'duplicate',
] as const;

export const reportStatusSchema = z.enum(REPORT_STATUSES);

export type ReportStatus = z.infer<typeof reportStatusSchema>;

/** Statuses after which a report no longer changes. */
export const FINAL_REPORT_STATUSES = [
  'resolved',
  'rejected',
  'duplicate',
] as const satisfies readonly ReportStatus[];

/** Statuses considered open: used, for example, to look for nearby duplicates. */
export const OPEN_REPORT_STATUSES = REPORT_STATUSES.filter(
  (status): status is Exclude<ReportStatus, (typeof FINAL_REPORT_STATUSES)[number]> =>
    !(FINAL_REPORT_STATUSES as readonly ReportStatus[]).includes(status),
);

export const REPORT_STATUS_LABELS: Record<ReportStatus, string> = {
  received: 'Recibido',
  validated: 'Validado',
  assigned: 'Asignado',
  in_progress: 'En atención',
  resolved: 'Resuelto',
  rejected: 'Rechazado',
  duplicate: 'Duplicado',
};
