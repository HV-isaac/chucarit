# Chucarit

App para que los habitantes del pueblo reporten problemas de la comunidad (baches, alumbrado, drenajes, tuberías rotas, etc.) y den seguimiento a su resolución. Es gratuita, sin manejo de dinero, y también es proyecto de portafolio: el código, los tests y la documentación deben verse profesionales.

## Monorepo

pnpm workspaces + Turborepo.

```
apps/
  api/      NestJS (TypeScript) — API REST
  mobile/   Expo (React Native, TypeScript) — app para ciudadanos
  admin/    Next.js (App Router) — panel para moderadores y responsables
packages/
  shared/   Esquemas zod, tipos y constantes compartidos (estados, categorías, roles)
  config/   tsconfig, ESLint y Prettier compartidos
infra/      docker-compose, Caddyfile, scripts de respaldo y despliegue
specs/      Trabajos de Spec Kit: una carpeta por trabajo (spec, plan, tareas)
.specify/   Spec Kit: plantillas, scripts y constitución (.specify/memory/constitution.md)
docs/adr/   Decisiones de arquitectura
```

Puertos locales: API `3100`, panel `3200`, Metro `8081`, Postgres `127.0.0.1:5437`.

Cada app tiene su propio `CLAUDE.md` con detalles específicos.

## Stack

- **Base de datos:** PostgreSQL 16 + PostGIS. ORM: Drizzle; SQL directo para consultas espaciales complejas.
- **API:** NestJS, validación con zod (esquemas en `packages/shared`), auth con JWT (access + refresh) y argon2.
- **Fotos:** DigitalOcean Spaces (S3-compatible). El cliente sube directo con URLs prefirmadas; las fotos nunca pasan por el API.
- **Push:** Expo Push Notifications.
- **Infra:** Droplet de DigitalOcean, Docker Compose, Caddy (HTTPS automático), GitHub Actions para CI/CD.

## Dominio

**Roles:** `citizen` (reporta y sigue sus reportes), `moderator` (valida, rechaza, marca duplicados), `responder` (cuadrilla o encargado que atiende), `admin`.

**Estados de un reporte** (enum en `packages/shared`):

```
received → validated → assigned → in_progress → resolved
    ↘ rejected     ↘ duplicate
```

- Toda transición se guarda en `report_status_history` (estado anterior, nuevo, quién, cuándo, nota). Es el corazón del seguimiento: nunca se modifica el estado sin crear historial.
- Las transiciones válidas y qué rol puede hacer cada una se definen en un solo lugar (`packages/shared`) y el API las valida.
- Un ciudadano solo puede editar o cancelar su reporte mientras está en `received`.

**Ubicación:** columna `geography(Point, 4326)` con índice GiST. Al crear un reporte se buscan reportes abiertos de la misma categoría a menos de ~50 m para sugerir duplicados.

**Privacidad:** el nombre y contacto de quien reporta nunca se exponen públicamente; solo moderadores y admins los ven. En un pueblo pequeño esto es crítico.

## Flujo de trabajo (Spec Kit)

Todo cambio no trivial es un **trabajo de Spec Kit**: una carpeta `specs/<NNN-nombre-en-kebab>/` con `spec.md` (qué y por qué: historias con prioridad, requisitos `FR-###`, criterios de éxito), `plan.md` (cómo; con `research.md`, `data-model.md` y `contracts/` si hacen falta) y `tasks.md`. Los principios que ningún trabajo se salta están en `.specify/memory/constitution.md`.

1. `/speckit-specify <descripción>` crea la spec; `/speckit-clarify` si algo queda ambiguo. **Se acuerda la spec antes de planear.**
2. `/speckit-plan` y `/speckit-tasks`.
3. Pedir al subagente `spec-architect` que revise el trabajo; `/speckit-analyze` para la coherencia entre artefactos.
4. Rama `feat/<nombre>` y `/speckit-implement`, delegando cada tarea al subagente de su área.
5. Al terminar, `code-reviewer` y (si toca auth, permisos, datos personales o subidas) `security-reviewer`.
6. Al fusionar a `main`: `**Status**: Done` y `**Closed**: <fecha>` en `spec.md`. La carpeta se queda en `specs/`.

Reglas de los artefactos:

- Van en español; los encabezados de estructura y las palabras MUST y SHALL quedan en inglés, como en las plantillas (`.specify/templates/overrides/`).
- El estado va en la cabecera de `spec.md`, en `**Status**`: `Draft` (por acordar), `Planned` (con plan y tareas, sin empezar), `In Progress` y `Done`.
- Cada tarea lleva casilla (`- [ ]` pendiente, `- [~]` en curso, `- [x]` hecha con el SHA corto del commit al final) y su área (`· shared`, `· db`, `· API`, `· Mobile`, `· Admin`, `· Infra`).
- Si cambia el alcance, se corrige primero `spec.md` y luego el plan y las tareas.
- Spec Kit se usa sin su extensión de git: la rama la creamos nosotros. Con varias sesiones a la vez, cada una fija su trabajo con `SPECIFY_FEATURE_DIRECTORY`.

Correcciones pequeñas (typos, estilos, un bug de una línea) no necesitan trabajo de Spec Kit.

## Subagentes

| Agente              | Úsalo para                                                                |
| ------------------- | ------------------------------------------------------------------------- |
| `spec-architect`    | Revisar trabajos de Spec Kit, modelo de datos, contratos del API, ADRs    |
| `api-nestjs`        | Módulos, controladores, servicios, guards y tests del API                 |
| `db-postgis`        | Esquema Drizzle, migraciones, índices y consultas espaciales              |
| `mobile-expo`       | Pantallas, navegación, cámara, mapa, cola offline y push en la app        |
| `admin-nextjs`      | Panel web: mapa, tablero de reportes, asignación, estadísticas            |
| `devops`            | Docker, Caddy, GitHub Actions, despliegue al Droplet, respaldos           |
| `code-reviewer`     | Revisión después de cada cambio (solo lectura)                            |
| `security-reviewer` | Auth, permisos por rol, datos personales, URLs prefirmadas (solo lectura) |

Delega por área. Si un cambio cruza áreas (p. ej. nuevo campo en reportes), empieza por `packages/shared` y `db-postgis`, luego API, luego clientes.

## Convenciones

- Código, nombres de variables, commits y ramas en **inglés**. Textos de UI, specs y docs en **español**.
- TypeScript estricto en todo el monorepo. Nada de `any` sin un comentario que lo justifique.
- Commits con Conventional Commits (`feat(api): ...`, `fix(mobile): ...`).
- Ramas: `feat/<nombre-del-trabajo>` (el nombre de la carpeta en `specs/`, sin el número).
- Cada feature incluye tests. Mínimo: tests unitarios de la lógica de dominio y tests e2e de los endpoints con permisos.
- Los tipos y esquemas que usan dos o más apps viven en `packages/shared`, no se duplican.
- Nunca leer, imprimir ni commitear `.env` ni credenciales. Las variables nuevas se documentan en `.env.example`.

## Comandos

```bash
pnpm install
pnpm dev                 # todo en paralelo (turbo)
pnpm lint
pnpm typecheck
pnpm test
pnpm --filter api test:e2e
docker compose -f infra/docker-compose.dev.yml up -d   # Postgres+PostGIS local
grep -l "Status\*\*: \(Draft\|Planned\|In Progress\)" specs/*/spec.md   # trabajos abiertos
```

Antes de dar una tarea por terminada: `pnpm lint && pnpm typecheck && pnpm test` deben pasar.
