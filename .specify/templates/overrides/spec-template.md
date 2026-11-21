# Feature Specification: [NOMBRE DEL TRABAJO]

**Feature Branch**: `[###-nombre-en-kebab]`

**Created**: [FECHA]

**Status**: Draft

**Áreas**: [las que toca: shared, db, API, Mobile, Admin, Infra]

**Input**: User description: "$ARGUMENTS"

<!--
  Reglas de Chucarit para esta spec:
  - Se escribe en español. Los encabezados de estructura y las palabras MUST y SHALL quedan en inglés.
  - Dice QUÉ y POR QUÉ, no cómo: el cómo va en plan.md.
  - Se acuerda con el usuario antes de planear. Mientras no esté acordada, Status es Draft.
  - Status: Draft (por acordar) · Planned (acordada, con plan y tareas, sin empezar) ·
    In Progress (en implementación o por comprobar) · Done (cerrado; se añade **Closed**: fecha).
  - «Feature Branch» es el nombre de la carpeta del trabajo; no se crea una rama con ese nombre.
-->

## Why

[El problema o la necesidad, y qué cambia para quien reporta, modera o atiende en Chucarit. Dos o tres párrafos.]

## User Scenarios & Testing *(mandatory)*

<!--
  Las historias van ORDENADAS POR PRIORIDAD (P1 la más importante) y cada una debe poder
  entregarse y comprobarse sola: con solo la primera ya hay algo que sirve.
-->

### User Story 1 - [Título breve] (Priority: P1)

[El recorrido, en lenguaje llano: quién, qué hace y qué obtiene]

**Why this priority**: [Qué valor da y por qué va en este lugar]

**Independent Test**: [Cómo se comprueba sola: qué se hace y qué se ve]

**Acceptance Scenarios**:

1. **Given** [estado inicial], **When** [acción], **Then** [resultado esperado]
2. **Given** [estado inicial], **When** [acción], **Then** [resultado esperado]

---

### User Story 2 - [Título breve] (Priority: P2)

[El recorrido, en lenguaje llano]

**Why this priority**: [Valor y lugar]

**Independent Test**: [Cómo se comprueba sola]

**Acceptance Scenarios**:

1. **Given** [estado inicial], **When** [acción], **Then** [resultado esperado]

---

[Más historias si hacen falta, cada una con su prioridad]

### Edge Cases

- ¿Qué pasa cuando [condición límite]?
- ¿Cómo responde el sistema ante [error]?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema MUST [capacidad concreta]
- **FR-002**: [Quién] MUST poder [interacción]
- **FR-003**: El sistema MUST NOT [lo que no debe pasar]

*Lo que no esté claro se marca, no se inventa:*

- **FR-004**: El sistema MUST [NEEDS CLARIFICATION: qué falta por decidir]

### Key Entities *(si el trabajo maneja datos)*

- **[Entidad 1]**: [Qué representa y sus atributos clave, sin implementación]
- **[Entidad 2]**: [Qué representa y cómo se relaciona con las demás]

## Success Criteria *(mandatory)*

### Measurable Outcomes

<!-- Medibles y sin tecnología: lo que se ve desde fuera cuando el trabajo está bien hecho. -->

- **SC-001**: [Resultado medible]
- **SC-002**: [Resultado medible]

## Assumptions

- [Lo que se da por sentado: usuarios, datos, entorno]
- [De qué depende: otro trabajo, un servicio, un dato que ya existe]

## Out of Scope

- [Lo que este trabajo no hace, y a dónde va si ya tiene sitio]
