# Constitución de Chucarit

Principios de trabajo del monorepo de Chucarit: el API NestJS (`apps/api`), la app Expo para
ciudadanos (`apps/mobile`), el panel Next.js para moderadores y responsables (`apps/admin`) y el
paquete compartido (`packages/shared`). Son pocos a propósito: el detalle de arquitectura,
comandos y convenciones está en `CLAUDE.md` y en el `CLAUDE.md` de cada app, que son la fuente;
esto dice lo que ningún trabajo se salta.

## Core Principles

### I. La privacidad de quien reporta no se negocia (NON-NEGOTIABLE)

El nombre y el contacto de quien reporta nunca se exponen públicamente: ni en respuestas del API
para ciudadanos, ni en logs, notificaciones, metadatos de fotos o exportaciones. Solo moderadores
y admins los ven. En un pueblo pequeño, una filtración pone en riesgo a una persona real. Todo
trabajo que toque datos personales pasa por `security-reviewer`.

### II. Ningún cambio de estado sin historial

Toda transición de un reporte escribe `report_status_history` (estado anterior, nuevo, quién,
cuándo, nota) en la misma transacción. El historial es solo de inserción. Las transiciones válidas
y el rol que puede hacer cada una se definen en un solo lugar, `packages/shared`, y el API las
valida; los clientes solo las muestran.

### III. El API decide; los clientes muestran

Las rutas del API están protegidas por defecto y las públicas se marcan explícitamente. Los
permisos por rol y por propiedad los aplica el API. La app y el panel pueden ocultar UI según el
rol, pero nunca son la autoridad.

### IV. Un contrato, un lugar

Los esquemas zod, tipos y constantes que usan dos o más apps viven en `packages/shared` y no se
duplican. Un trabajo que cambia el contrato lo dice en «Contrato afectado» de su plan, empieza
por `packages/shared` y `db`, luego el API, luego los clientes.

### V. La spec se acuerda antes de planear

Primero se escribe `spec.md` y se acuerda con el usuario; solo entonces se planea. No se escribe
código no trivial sin spec, plan y tareas (las correcciones pequeñas no lo necesitan). Si cambia
el alcance, se corrige primero `spec.md` y después el plan y las tareas.

### VI. Cada tarea lleva casilla y SHA

Toda tarea de `tasks.md` lleva casilla, sin excepción: `- [ ]` pendiente, `- [~]` en curso,
`- [x]` hecha con el SHA corto del commit al final de la línea, y su área (`· shared`, `· db`,
`· API`, `· Mobile`, `· Admin`, `· Infra`). La casilla se actualiza al avanzar, no al final.

### VII. Calidad de portafolio: tipos estrictos y tests

TypeScript estricto en todo el monorepo, sin `any` sin un comentario que lo justifique. Cada
trabajo incluye tests: unitarios de la lógica de dominio y e2e de los endpoints con permisos
(caso feliz, sin token, rol incorrecto, recurso ajeno). Un trabajo no está terminado si
`pnpm lint && pnpm typecheck && pnpm test` no pasa.

### VIII. Los artefactos van en español

`spec.md`, `plan.md`, `tasks.md` y lo que los acompaña se escriben en español, igual que los
textos de UI y la documentación. Los encabezados de estructura de las plantillas y las palabras
MUST y SHALL quedan en inglés, porque las skills de Spec Kit las buscan así. El código, los
nombres, los commits y las ramas van en inglés.

## Restricciones técnicas

- PostgreSQL 16 + PostGIS con Drizzle; ubicación en `geography(Point, 4326)` con índice GiST.
- Las fotos nunca pasan por el API: el cliente sube directo a Spaces con URLs prefirmadas.
- Sin manejo de dinero. La app es gratuita.
- Una dependencia nueva de peso (framework, servicio externo) se acuerda en el plan y, si cambia
  la arquitectura, se documenta con un ADR en `docs/adr/`.
- Nunca se leen, imprimen ni commitean `.env` ni credenciales; las variables nuevas van en el
  `.env.example` que corresponda.

## Flujo de trabajo

1. `/speckit-specify` crea `specs/<NNN-nombre>/spec.md` (`**Status**: Draft`); `/speckit-clarify`
   si algo queda ambiguo. Se acuerda con el usuario.
2. `/speckit-plan` y `/speckit-tasks` (`**Status**: Planned`). `spec-architect` revisa el trabajo
   y `/speckit-analyze` comprueba la coherencia entre artefactos.
3. Rama `feat/<nombre>`; `/speckit-implement` delega cada tarea al subagente de su área
   (`**Status**: In Progress`).
4. `code-reviewer` al terminar, y `security-reviewer` si toca auth, permisos, datos personales o
   subidas.
5. Al fusionar a `main`: `**Status**: Done` y `**Closed**: <fecha>`. La carpeta se queda en
   `specs/`.

## Governance

Esta constitución manda sobre las plantillas y sobre lo que proponga una skill: un plan que se
aparte de un principio lo dice en «Complexity Tracking» y se acuerda con el usuario antes de
seguir. Las convenciones de código son las de `CLAUDE.md`; si las dos se contradicen, se corrige
la que esté desfasada en el mismo trabajo. Cambiar un principio es cambiar este archivo, con su
versión y su fecha.

**Version**: 1.0.0 | **Ratified**: 2026-11-20 | **Last Amended**: 2026-11-20
