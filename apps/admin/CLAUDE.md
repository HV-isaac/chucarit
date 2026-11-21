# apps/admin — Next.js

@AGENTS.md

Panel para `moderator`, `responder` y `admin`. Los ciudadanos no entran aquí.

## Stack

- Next.js con App Router y Server Components por defecto; Client Components solo donde haya interacción.
- Tailwind CSS 4 + shadcn/ui (estilo `base-nova` sobre Base UI; componentes con `pnpm --filter admin exec shadcn add <componente>`).
- TanStack Query en componentes cliente que necesiten refrescar datos.
- Mapa: MapLibre GL (`react-map-gl/maplibre`) con tiles gratuitos.
- Gráficas: Recharts.

## Pantallas

- **Bandeja de entrada:** reportes en `received` para validar, rechazar o marcar duplicado (vinculándolo al original).
- **Tablero:** reportes por estado (vista de lista y kanban), filtros por categoría, colonia y fecha.
- **Mapa:** todos los reportes abiertos, coloreados por estado, con clustering.
- **Detalle:** fotos, ubicación, historial, datos de contacto del autor (solo staff), acciones de transición con nota obligatoria al rechazar o resolver.
- **Asignación:** asignar a un `responder`; el responder ve "Mis asignaciones".
- **Estadísticas:** reportes creados/resueltos por mes, tiempo promedio de resolución, por categoría y colonia. Exportable a CSV. Estas cifras son material de portafolio.

## Reglas

- La sesión usa los mismos JWT del API, guardados en cookies httpOnly mediante route handlers de Next. Nunca tokens en localStorage.
- Middleware que redirige a login si no hay sesión y oculta secciones según rol. El API sigue siendo la autoridad de permisos; el panel solo oculta la UI.
- Acciones destructivas o de cambio de estado piden confirmación.
- Textos en español.

## Comandos

```bash
pnpm --filter admin dev         # http://localhost:3200
pnpm --filter admin test        # Vitest + Testing Library
pnpm --filter admin build
```
