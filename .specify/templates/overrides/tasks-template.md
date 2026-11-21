---

description: "Plantilla de la lista de tareas de un trabajo de Chucarit"
---

# Tasks: [NOMBRE DEL TRABAJO]

**Input**: Design documents from `/specs/[###-nombre-en-kebab]/`

**Prerequisites**: plan.md (obligatorio), spec.md (obligatorio para las historias), research.md, data-model.md, contracts/

**Leyenda:** `[ ]` pendiente · `[~]` en curso · `[x]` hecha, con el SHA corto del commit al final.

**Estado:** [una línea: en qué va el trabajo y qué falta]

**Tests**: se incluyen cuando la spec los pide o siempre que haya lógica de dominio o endpoints (unitarios de dominio y e2e con permisos).

**Organization**: las tareas van agrupadas por historia, para entregar y comprobar cada una sola.

## Format: `[ID] [P?] [Story] Descripción · Área · sha`

- **[P]**: puede ir en paralelo (otros archivos, sin dependencias)
- **[Story]**: la historia a la que sirve (US1, US2…); las de preparación y cierre no la llevan
- La descripción dice la ruta exacta y cómo se comprueba
- **· Área**: dónde se hace (`· shared`, `· db`, `· API`, `· Mobile`, `· Admin`, `· Infra`; varias:
  `· API, Admin`). Define también a qué subagente se delega
- **· sha**: al marcar `[x]`, el SHA corto del commit, al final de la línea
- **Toda** tarea lleva casilla, sin excepción

<!--
  ============================================================================
  Las tareas de abajo son DE MUESTRA. `/speckit-tasks` las sustituye por las reales, a partir de:
  - las historias de spec.md, con su prioridad
  - plan.md, data-model.md y contracts/

  Lo que quede por comprobar al cerrar (dispositivo, despliegue) no se pierde: queda como
  tarea abierta y se anota en la línea de **Estado**.
  ============================================================================
-->

## Phase 1: Setup

**Purpose**: lo que hace falta antes de empezar (rama, base de datos)

- [ ] T001 Rama `feat/<nombre>` desde `main` · Infra
- [ ] T002 [P] Base local (`infra/docker-compose.dev.yml`) migrada desde cero · db

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: lo que bloquea a todas las historias (esquemas compartidos, migración, permisos)

**⚠️ CRITICAL**: ninguna historia empieza antes de terminar esta fase

- [ ] T003 Esquemas zod y constantes en `packages/shared/src/...` con sus tests · shared
- [ ] T004 Tabla y migración en `apps/api/src/db/...` · db
- [ ] T005 [P] Permisos por rol en `apps/api/src/...` · API

**Checkpoint**: la base está lista; las historias pueden empezar

---

## Phase 3: User Story 1 - [Título] (Priority: P1) 🎯 MVP

**Goal**: [qué entrega esta historia]

**Independent Test**: [cómo se comprueba sola]

- [ ] T006 [P] [US1] Tests unitarios y e2e (feliz, sin token, rol incorrecto, recurso ajeno) en `apps/api/...` · API
- [ ] T007 [US1] Servicio y controlador en `apps/api/src/...` · API
- [ ] T008 [US1] Pantalla en `apps/admin/src/app/...` con su test · Admin
- [ ] T009 [US1] Pantalla en `apps/mobile/app/...` con su test · Mobile

**Checkpoint**: la historia 1 funciona y se puede comprobar sola

---

## Phase 4: User Story 2 - [Título] (Priority: P2)

**Goal**: [qué entrega esta historia]

**Independent Test**: [cómo se comprueba sola]

- [ ] T010 [P] [US2] ... · API
- [ ] T011 [US2] ... · Admin

**Checkpoint**: las historias 1 y 2 funcionan cada una por su lado

---

[Más fases de historia si hacen falta, con el mismo patrón]

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: documentación, contrato y verificación de punta a punta

- [ ] TXXX [P] `CLAUDE.md` de cada app que cambió · API, Mobile, Admin
- [ ] TXXX `pnpm lint && pnpm typecheck && pnpm test` y e2e del API · API, Mobile, Admin
- [ ] TXXX Revisión con `code-reviewer` (y `security-reviewer` si toca auth, permisos, datos personales o subidas)
- [ ] TXXX Verificación de verdad: panel en el navegador, app en simulador · Admin, Mobile
- [ ] TXXX Fusionar a `main` y cerrar (`**Status**: Done` y `**Closed**` en spec.md)

---

## Dependencies & Execution Order

- **Setup (fase 1)**: sin dependencias
- **Foundational (fase 2)**: tras Setup; bloquea todas las historias
- **Historias (fase 3 en adelante)**: tras Foundational, en orden de prioridad (P1 → P2 → P3)
- **Polish (última fase)**: con las historias que se vayan a entregar ya terminadas
- Dentro de una historia: tests antes de implementar, modelos antes de servicios, el API antes
  de sus clientes

## Notes

- Un commit por tarea o por grupo lógico; el SHA se anota al marcar `[x]`
- Si cambia el alcance, se corrige primero `spec.md`, luego `plan.md` y estas tareas
- Se evita: tareas vagas, dos tareas sobre el mismo archivo en paralelo, historias que dependan
  una de otra
