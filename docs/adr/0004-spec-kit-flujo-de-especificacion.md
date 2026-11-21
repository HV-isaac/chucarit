# 0004. Spec Kit como flujo de especificación

- Estado: Aceptada
- Fecha: 2026-11-21

## Contexto

Chucarit se desarrolla con agentes de IA por área (API, base de datos, app, panel). Sin una especificación escrita y acordada antes del código, cada agente interpreta el pedido a su manera y los cambios que cruzan capas (un estado nuevo toca shared, db, API y clientes) quedan incompletos. El `CLAUDE.md` original proponía OpenSpec para esto. El autor ya usa Spec Kit en otro proyecto y quiere un solo flujo para todos sus proyectos.

## Decisión

Todo cambio no trivial es una carpeta de **Spec Kit** (`specify-cli` 1.1.3, numeración secuencial) en `specs/<NNN-nombre-en-kebab>/`:

- `spec.md`: qué y por qué (historias con prioridad, requisitos `FR-###`, criterios de éxito) y `**Status**` (`Draft`, `Planned`, `In Progress`, `Done`). Se acuerda con el usuario antes de planear.
- `plan.md` (con `research.md`, `data-model.md` y `contracts/` si hacen falta) y `tasks.md`, donde cada tarea lleva casilla, área (`· shared`, `· db`, `· API`, `· Mobile`, `· Admin`, `· Infra`) y el SHA del commit al terminarla.

Las plantillas propias están en `.specify/templates/overrides/` (spec, plan y tareas, en español) y los principios que ningún trabajo se salta en `.specify/memory/constitution.md`. Aquí Spec Kit vive **dentro del repo**: `.specify/` y `specs/` se versionan con el código, así que el repo es autocontenido.

Se usa **sin la extensión de git** de Spec Kit: las ramas se crean a mano como `feat/<nombre>` (el nombre de la carpeta sin el número). Con varias sesiones a la vez, cada una fija su trabajo con `SPECIFY_FEATURE_DIRECTORY`.

## Alternativas consideradas

- **OpenSpec.** Ligero y con buen modelo de «cambio propuesto sobre specs vigentes», pero significaría mantener dos flujos distintos entre proyectos del mismo autor.
- **Issues de GitHub sin specs.** Cero herramientas extra, pero el texto vive fuera del repo, no se versiona junto al código y no da estructura (requisitos, criterios de éxito, tareas por área).
- **Solo ADRs.** Sirven para decisiones de arquitectura, no para describir y seguir un trabajo de producto con historias y tareas.

## Consecuencias

- Positivas: cada feature deja un rastro revisable (qué se pidió, cómo se planeó, qué commit cerró cada tarea), útil para revisión con `spec-architect` y como material de portafolio.
- Positivas: un solo flujo para el autor en todos sus proyectos; las skills `/speckit-*` ya están probadas.
- Negativas: más ceremonia por cambio; las correcciones pequeñas quedan fuera a propósito, y la frontera de «no trivial» es de criterio.
- Negativas: Spec Kit y sus skills evolucionan rápido; actualizar `specify` puede cambiar plantillas base y obliga a revisar los overrides.
- Negativas: `tasks.md` solo vale si se actualiza al avanzar; si no, desinforma.
