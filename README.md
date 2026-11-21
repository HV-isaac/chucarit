# Chucarit

App gratuita para que los habitantes del pueblo reporten problemas de la comunidad (baches, alumbrado, drenajes, tuberías rotas) y den seguimiento a su resolución, desde que se recibe el reporte hasta que se resuelve.

- **App para ciudadanos** (`apps/mobile`): reportar con foto y ubicación en menos de un minuto, aun sin señal, y seguir la línea de tiempo de cada reporte.
- **Panel** (`apps/admin`): moderadores validan o marcan duplicados, se asigna a una cuadrilla, y se miden tiempos de resolución por categoría y colonia.
- **API** (`apps/api`): una sola máquina de estados con historial de cada cambio y permisos por rol. Los datos de quien reporta nunca se exponen públicamente.

## Stack

| Parte           | Tecnología                                                                             |
| --------------- | -------------------------------------------------------------------------------------- |
| Monorepo        | pnpm workspaces + Turborepo, TypeScript estricto                                       |
| API             | NestJS 12, zod, Drizzle ORM, PostgreSQL 16 + PostGIS                                   |
| App             | Flutter 3.44, go_router, Riverpod                                                      |
| Panel           | Next.js 16 (App Router), Tailwind CSS 4, shadcn/ui                                     |
| Compartido      | `@chucarit/shared`: estados, roles y transiciones (zod), con Dart generado para la app |
| Infraestructura | Droplet de DigitalOcean, Docker Compose, Caddy, Spaces, GitHub Actions                 |

## Estructura

```
apps/
  api/        API REST (NestJS)
  mobile/     App para ciudadanos (Flutter)
  admin/      Panel para moderadores y responsables (Next.js)
packages/
  shared/     Esquemas, tipos y constantes del dominio
  config/     tsconfig y ESLint compartidos
infra/        docker-compose y scripts de despliegue
specs/        Especificaciones de cada trabajo (Spec Kit)
docs/adr/     Decisiones de arquitectura
```

## Desarrollo

Requisitos: Node.js 24, pnpm 11 (`corepack enable`), Docker y Flutter 3.44.

```bash
pnpm install
docker compose -f infra/docker-compose.dev.yml up -d
cp apps/api/.env.example apps/api/.env
pnpm dev
```

| Servicio | URL                             |
| -------- | ------------------------------- |
| API      | http://localhost:3100/health    |
| Panel    | http://localhost:3200           |
| App      | `cd apps/mobile && flutter run` |

Calidad:

```bash
pnpm lint && pnpm typecheck && pnpm test
pnpm test:e2e     # e2e del API contra la base de pruebas
```

## Integración continua

[GitHub Actions](.github/workflows/ci.yml) corre en cada PR y en cada push a `main`, con tres jobs en paralelo:

| Job          | Qué valida                                                                                                                                              |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `typescript` | Formato (Prettier), ESLint, tipos, tests unitarios y build del API, el panel y `packages/shared`, incluido que el Dart generado para la app esté al día |
| `api-e2e`    | Tests e2e del API contra PostgreSQL + PostGIS reales                                                                                                    |
| `flutter`    | `dart format`, `flutter analyze` y `flutter test` de la app                                                                                             |

## Cómo se trabaja

Cada cambio no trivial empieza como una especificación en `specs/` (Spec Kit): historias con prioridad, requisitos y criterios de éxito, luego plan y tareas, y solo entonces código. Los principios que ningún cambio se salta están en [`.specify/memory/constitution.md`](.specify/memory/constitution.md); el contexto para agentes de IA, en [`CLAUDE.md`](CLAUDE.md).
