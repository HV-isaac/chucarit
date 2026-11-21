# 0001. Monorepo con pnpm workspaces y Turborepo

- Estado: Aceptada
- Fecha: 2026-11-21

## Contexto

Chucarit tiene tres aplicaciones (API NestJS en `apps/api`, panel Next.js en `apps/admin`, app Flutter en `apps/mobile`) que comparten un mismo dominio: estados del reporte, roles y la tabla de transiciones que dice qué rol puede hacer cada cambio. Esa tabla vive en `packages/shared/src/report-transitions.ts` y el API la usa para validar; el panel y la app, para decidir qué acciones mostrar. Si cada aplicación estuviera en su repo, `@chucarit/shared` tendría que publicarse en un registro (con versionado y un paso de publicación por cada cambio) o copiarse, y la copia es justo lo que la constitución prohíbe (principio IV).

Además es un proyecto de portafolio: una persona que lo revisa debe poder clonar un repo, correr un comando y ver todo, con un solo historial y un solo CI.

## Decisión

Un monorepo con **pnpm workspaces** (`pnpm-workspace.yaml`: `apps/*` y `packages/*`) y **Turborepo** (`turbo.json`) como orquestador.

- `lint`, `typecheck`, `test` y `build` se corren desde la raíz (`pnpm lint`, etc.) y Turborepo los ejecuta en paralelo con caché por paquete. Todas las tareas llevan `dependsOn: ["^build"]`: antes de verificar el API o el panel se compila `@chucarit/shared`, que se consume desde `dist/` (su `exports` apunta a `./dist/index.js`).
- El **catálogo de pnpm** (`catalog:` en `pnpm-workspace.yaml`) fija una sola versión de TypeScript, zod, Vitest, ESLint, Prettier y `@types/node` para todos los paquetes.
- `packages/config` concentra tsconfig y ESLint compartidos.
- La app Flutter vive en `apps/mobile` con un `package.json` mínimo que solo conecta Flutter con Turborepo: `lint` = `dart format --set-exit-if-changed` + `flutter analyze`, `test` = `flutter test`. Sus dependencias reales están en `pubspec.yaml`.

## Alternativas consideradas

- **Repos separados.** Aislamiento total, pero obliga a publicar `@chucarit/shared` o copiarlo, multiplica CI y deja los cambios que cruzan capas (un estado nuevo toca shared, db, API y clientes) repartidos en varios PR sin orden garantizado.
- **Nx.** Más capacidades (generadores, grafo de proyectos, plugins para Flutter de terceros), pero más configuración y conceptos de los que necesita un proyecto de tres apps y dos paquetes.
- **npm o yarn workspaces sin orquestador.** Resuelven el enlace entre paquetes, pero no el orden (`^build`) ni la caché; habría que escribir scripts para compilar shared antes que el resto.

## Consecuencias

- Positivas: un cambio de dominio es un solo commit y un solo PR, de `packages/shared` a los clientes; `pnpm lint && pnpm typecheck && pnpm test` verifica todo el sistema, incluida la app Flutter; las tareas sin cambios salen de caché.
- Positivas: el catálogo evita que el API y el panel compilen con versiones distintas de TypeScript o zod.
- Negativas: el `package.json` de `apps/mobile` es un adaptador, no un paquete real; Turborepo solo ve sus archivos, no entiende `pubspec.lock`, y `typecheck`/`build` no aplican a Flutter.
- Negativas: el CI necesitará Node, pnpm y Flutter en la misma máquina, y un cambio en `packages/shared` invalida la caché de todo lo que depende de él.
- Negativas: `@chucarit/shared` se consume compilado. Si una app se corre por su cuenta (p. ej. `pnpm --filter api dev`) sin compilar shared, importa un `dist/` viejo; `pnpm dev` desde la raíz lo evita, porque compila shared y lo deja en modo watch.
