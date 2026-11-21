# Implementation Plan: [TRABAJO]

**Branch**: `[###-nombre-en-kebab]` | **Date**: [FECHA] | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/[###-nombre-en-kebab]/spec.md`

**Note**: Esta plantilla la rellena `/speckit-plan`. Se escribe en español; los encabezados de
estructura quedan en inglés. «Branch» es la carpeta del trabajo: la rama es `feat/<nombre>`.

## Summary

[De la spec: el requisito principal. De research.md: el enfoque técnico elegido]

## Technical Context

<!--
  Se rellena con lo que ya dicen CLAUDE.md y el CLAUDE.md de cada app que toca el trabajo, no de memoria.
  Lo que no se sepa se marca NEEDS CLARIFICATION.
-->

**Language/Version**: [p. ej. TypeScript estricto / NestJS, Expo, Next.js]

**Primary Dependencies**: [las que usa el trabajo; una nueva se acuerda antes]

**Storage**: [p. ej. PostgreSQL + PostGIS con Drizzle y migraciones, Spaces, o N/A]

**Testing**: [p. ej. unitarios de dominio, e2e del API con base real, jest-expo, Vitest]

**Target Platform**: [API en el Droplet, panel en el navegador, iOS y Android]

**Project Type**: [las apps y paquetes del monorepo que cruza]

**Performance Goals**: [si aplican]

**Constraints**: [límites del contrato, topes, compatibilidad con versiones de la app ya publicadas]

**Scale/Scope**: [cuántas pantallas, endpoints, migraciones]

## Constitution Check

*GATE: se pasa antes de la fase 0 y se repasa después del diseño.*

[Una línea por principio de `.specify/memory/constitution.md`: cumple, o por qué no]

## Contrato afectado

<!--
  Qué cambia en el contrato del API (esquemas zod de `packages/shared`, rutas, roles, errores) y
  quién lo sigue. Si no cambia nada, se dice: «Ninguno».
  El detalle de cada endpoint va en contracts/.
-->

| Qué cambia | Dónde (shared / API) | Quién lo sigue |
|---|---|---|
| [endpoint, esquema, enum o código de error] | [archivo] | [Mobile, Admin: archivo de cada uno] |

## Project Structure

### Documentation (this feature)

```text
specs/[###-nombre-en-kebab]/
├── spec.md              # Qué y por qué (/speckit-specify)
├── plan.md              # Este archivo (/speckit-plan)
├── research.md          # Decisiones, con su porqué y las alternativas
├── data-model.md        # Entidades, columnas y migraciones (si hay datos)
├── quickstart.md        # Cómo se comprueba de punta a punta
├── contracts/           # Endpoints y formas que cambian (si cambia el contrato)
└── tasks.md             # Tareas (/speckit-tasks; no lo crea /speckit-plan)
```

### Source Code

<!-- Las rutas reales del monorepo que toca. Sin opciones de muestra. -->

```text
packages/shared/src/...
apps/api/src/...
apps/mobile/app/...  apps/mobile/src/...
apps/admin/src/app/...
```

**Structure Decision**: [Qué se añade y dónde, siguiendo la arquitectura de cada app]

## Complexity Tracking

> **Solo si el Constitution Check tiene algo que justificar**

| Excepción | Por qué hace falta | Por qué no sirve lo más simple |
|-----------|--------------------|--------------------------------|
| [p. ej. una dependencia nueva] | [necesidad] | [por qué no basta lo que hay] |
