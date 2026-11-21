# Decisiones de arquitectura

Registro de las decisiones que dan forma a Chucarit: qué se decidió, por qué y qué se sacrificó.

| ADR  | Título                                                                                                          | Estado   |
| ---- | --------------------------------------------------------------------------------------------------------------- | -------- |
| 0001 | [Monorepo con pnpm workspaces y Turborepo](0001-monorepo-pnpm-turborepo.md)                                     | Aceptada |
| 0002 | [DigitalOcean (Droplet + Spaces) en vez de Supabase](0002-digitalocean-droplet-spaces.md)                       | Aceptada |
| 0003 | [PostgreSQL + PostGIS para ubicaciones](0003-postgresql-postgis-ubicaciones.md)                                 | Aceptada |
| 0004 | [Spec Kit como flujo de especificación](0004-spec-kit-flujo-de-especificacion.md)                               | Aceptada |
| 0005 | [Flutter para la app de ciudadanos](0005-flutter-app-ciudadanos.md)                                             | Aceptada |
| 0006 | [Contrato del dominio para Flutter: Dart generado desde `@chucarit/shared`](0006-dart-generado-desde-shared.md) | Aceptada |

## Cómo agregar un ADR

1. Se escribe un ADR cuando una decisión cambia la arquitectura: un framework, un servicio externo, la forma del contrato entre apps o de la infraestructura (constitución, «Restricciones técnicas»). Un trabajo de `specs/` que lo necesite lo dice en su plan.
2. Crea `docs/adr/NNNN-titulo-en-kebab.md` con el número que sigue, en español, con esta forma:

   ```
   # NNNN. Título

   - Estado: Propuesta | Aceptada | Reemplazada por NNNN
   - Fecha: AAAA-MM-DD

   ## Contexto
   ## Decisión
   ## Alternativas consideradas
   ## Consecuencias
   ```

3. Una página como máximo. Rutas reales del repo, cifras concretas y consecuencias negativas además de las positivas.
4. Pide a `spec-architect` que lo revise y agrega la línea a la tabla de arriba.
5. Un ADR aceptado no se reescribe: si la decisión cambia, se escribe uno nuevo y el anterior pasa a «Reemplazada por NNNN».
