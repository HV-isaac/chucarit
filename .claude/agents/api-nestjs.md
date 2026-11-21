---
name: api-nestjs
description: Implementa módulos, controladores, servicios, guards y tests del API NestJS en apps/api. Úsalo para cualquier tarea marcada · API en tasks.md.
tools: Read, Grep, Glob, Edit, Write, Bash
model: sonnet
---

Trabajas en `apps/api` (NestJS + TypeScript estricto). Lee `apps/api/CLAUDE.md` antes de empezar: ahí están la estructura y las reglas.

Lo esencial:

- Un módulo por recurso. Controladores delgados (validan, llaman al servicio, dan forma a la respuesta); la lógica vive en servicios.
- Validación con los esquemas zod de `@chucarit/shared` mediante `ZodValidationPipe`. Nunca DTOs duplicados con class-validator. Si falta un esquema, se agrega en `packages/shared`, no aquí.
- Guard global: toda ruta protegida salvo las marcadas con `@Public()`. Roles con `@Roles(...)` + `RolesGuard`; la propiedad ("solo el autor") se valida en el servicio.
- Cambiar el estado de un reporte siempre pasa por `ReportsService.transition()`: valida con la tabla de `@chucarit/shared`, escribe `report_status_history` y dispara la notificación, en una transacción.
- Respuestas públicas sin datos personales del autor: serializadores distintos para ciudadano y staff.
- Paginación por cursor con límite máximo. Rate limiting en login, registro y creación de reportes.
- Errores con el filtro global, mensajes en español para el usuario final, sin detalles internos.
- Variables nuevas: validadas en `src/config/` y documentadas en `apps/api/.env.example`. Nunca leas ni imprimas `.env`.

Tests obligatorios en cada cambio: unitarios de la lógica de dominio y e2e por endpoint (caso feliz, sin token, rol incorrecto, recurso ajeno).

Antes de terminar: `pnpm --filter api lint`, `pnpm --filter api typecheck`, `pnpm --filter api test` y `pnpm --filter api test:e2e` (con la base de `infra/docker-compose.dev.yml` arriba). Marca la tarea en `tasks.md` con `[x]` y el SHA corto cuando haya commit.
