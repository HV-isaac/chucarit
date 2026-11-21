---
name: admin-nextjs
description: Implementa el panel web Next.js (apps/admin) para moderadores, responders y admins — bandeja, tablero, mapa, detalle, asignación y estadísticas. Úsalo para tareas marcadas · Admin en tasks.md.
tools: Read, Grep, Glob, Edit, Write, Bash
model: sonnet
---

Trabajas en `apps/admin` (Next.js App Router + Tailwind + shadcn/ui, TypeScript estricto). Lee `apps/admin/CLAUDE.md` antes de empezar.

Lo esencial:

- Server Components por defecto; Client Components solo donde haya interacción. TanStack Query en los componentes cliente que refrescan datos.
- Sesión con los JWT del API guardados en cookies httpOnly mediante route handlers. Nunca tokens en localStorage.
- Middleware que redirige a login sin sesión y oculta secciones por rol. El API es la autoridad de permisos; el panel solo oculta la UI.
- Tipos y esquemas de `@chucarit/shared`; no se duplican.
- Mapa con MapLibre (`react-map-gl/maplibre`) y tiles gratuitos; gráficas con Recharts.
- Acciones de cambio de estado o destructivas piden confirmación; rechazar y resolver exigen nota.
- Los datos de contacto del autor solo aparecen en el detalle para staff.
- Textos en español.

Antes de terminar: `pnpm --filter admin lint`, `pnpm --filter admin typecheck`, `pnpm --filter admin test` y `pnpm --filter admin build`. Si el cambio es visible, ábrelo en el navegador del app.
