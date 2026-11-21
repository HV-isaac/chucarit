import { z } from 'zod';

/**
 * - `citizen`: reporta y sigue sus reportes.
 * - `moderator`: valida, rechaza y marca duplicados.
 * - `responder`: cuadrilla o encargado que atiende.
 * - `admin`: todo lo anterior y la administración.
 */
export const ROLES = ['citizen', 'moderator', 'responder', 'admin'] as const;

export const roleSchema = z.enum(ROLES);

export type Role = z.infer<typeof roleSchema>;

/** Roles that work in the admin panel and can see reporters' personal data or act on reports. */
export const STAFF_ROLES = ['moderator', 'responder', 'admin'] as const satisfies readonly Role[];

export const ROLE_LABELS: Record<Role, string> = {
  citizen: 'Ciudadano',
  moderator: 'Moderador',
  responder: 'Responsable',
  admin: 'Administrador',
};
