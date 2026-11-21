# apps/api — NestJS

@AGENTS.md

NestJS 12: el proyecto es ESM (los imports relativos terminan en `.js`) y los tests corren con Vitest (`vi.fn()`, no `jest.fn()`).

## Estructura

```
src/
  main.ts
  app.module.ts
  config/            Carga y validación de variables de entorno (zod): env()
  db/                DbModule (pool de pg + Drizzle, token DATABASE) y schema/
  health/            GET /health (API + PostGIS) para Caddy y el despliegue
  auth/              Registro, login, refresh, guards (JwtAuthGuard, RolesGuard)
  users/
  reports/           CRUD, transiciones de estado, historial, duplicados cercanos
  categories/
  uploads/           Emisión de URLs prefirmadas para Spaces
  notifications/     Envío de push por FCM con firebase-admin
  stats/             Métricas de impacto (resueltos, tiempo promedio, por colonia)
  common/            Pipes (ZodValidationPipe), filtros de error, decoradores (@Roles, @CurrentUser)
test/                Tests e2e (supertest) contra chucarit_test
drizzle/             Migraciones generadas por drizzle-kit (pnpm --filter api db:generate)
```

## Reglas

- Un módulo por recurso. Los controladores solo validan entrada, llaman al servicio y dan forma a la respuesta; la lógica vive en servicios.
- Validación con los esquemas zod de `@chucarit/shared` mediante el `StandardSchemaValidationPipe` de Nest (`@Body({ schema })`). No declarar DTOs duplicados con class-validator.
- Toda ruta está protegida por defecto (guard global). Las públicas se marcan explícitamente con `@Public()`.
- Permisos por rol con `@Roles(...)` + `RolesGuard`. Permisos por propiedad (p. ej. "solo el autor") se validan en el servicio.
- Cambiar el estado de un reporte siempre pasa por `ReportsService.transition()`, que valida la transición con la tabla de `@chucarit/shared`, escribe el historial y dispara la notificación, todo en una transacción.
- Respuestas públicas de reportes nunca incluyen datos personales del autor. Usa serializadores distintos para ciudadano y para staff.
- Paginación por cursor en listados. Límite máximo por página.
- Rate limiting (`@nestjs/throttler`) en login, registro y creación de reportes.
- Errores con el filtro global; mensajes en español para el usuario final, sin exponer detalles internos.

## Uploads

1. El cliente pide `POST /uploads/presign` con tipo MIME y tamaño.
2. El API valida (solo `image/jpeg`, `image/png`, `image/webp`; máximo ~5 MB) y devuelve una URL prefirmada PUT que expira en pocos minutos, con una key bajo `reports/<uuid>/`.
3. El cliente sube directo a Spaces y manda las keys al crear el reporte. El API verifica que las keys existan y pertenezcan al flujo de ese usuario.

## Tests

- Unitarios para la lógica de transiciones y permisos.
- e2e por endpoint: caso feliz, sin token, rol incorrecto, recurso ajeno.
- La base de prueba (`chucarit_test`) se levanta con el mismo docker-compose de desarrollo y se limpia entre suites. `vitest.config.e2e.ts` fuerza `DATABASE_URL` a `TEST_DATABASE_URL`: los e2e nunca tocan la base de desarrollo.

## Comandos

```bash
pnpm --filter api dev           # http://localhost:3100 (lee apps/api/.env)
pnpm --filter api test          # unitarios
pnpm --filter api test:e2e      # e2e contra chucarit_test
pnpm --filter api db:generate   # migración a partir de src/db/schema
pnpm --filter api db:migrate
```
