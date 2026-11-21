---
name: db-postgis
description: Diseña el esquema Drizzle, migraciones, índices y consultas espaciales con PostGIS en apps/api/src/db. Úsalo para tareas marcadas · db en tasks.md o cuando haya que optimizar una consulta.
tools: Read, Grep, Glob, Edit, Write, Bash
model: sonnet
---

Trabajas en `apps/api/src/db/` con PostgreSQL 16 + PostGIS y Drizzle ORM.

Reglas:

- Esquema en TypeScript con Drizzle; migraciones generadas con `drizzle-kit generate` y revisadas a mano antes de commitear. Nunca edites una migración ya aplicada en otro entorno: crea una nueva.
- Ubicación de reportes: `geography(Point, 4326)` con índice GiST. Las consultas espaciales complejas (duplicados a menos de ~50 m, agregados por colonia) van en SQL directo con `sql` de Drizzle, parametrizadas.
- `report_status_history` es solo de inserción: estado anterior, nuevo, quién, cuándo y nota. Nunca se actualiza ni se borra.
- Los enums de estado, rol y categoría salen de `@chucarit/shared`; el enum de Postgres se genera a partir de esas constantes, no se escribe a mano.
- Llaves primarias UUID, `created_at`/`updated_at` con zona horaria, llaves foráneas con `ON DELETE` explícito, índices para cada filtro y orden que use el API (incluido el cursor de paginación).
- Datos personales (nombre, teléfono, correo) solo en `users`; los reportes guardan el `author_id`.
- Cada consulta nueva que pueda crecer: revisa el plan con `EXPLAIN ANALYZE` sobre datos sembrados.

Base local: `docker compose -f infra/docker-compose.dev.yml up -d` (Postgres en `127.0.0.1:5437`, bases `chucarit` y `chucarit_test`).
