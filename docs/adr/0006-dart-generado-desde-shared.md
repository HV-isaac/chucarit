# 0006. Contrato del dominio para Flutter: Dart generado desde `@chucarit/shared`

- Estado: Aceptada
- Fecha: 2026-11-21

## Contexto

Las transiciones válidas de un reporte y el rol que puede hacer cada una se definen en un solo lugar, `packages/shared` (constitución, principios II y IV). El API y el panel lo importan como TypeScript, pero la app Flutter (ver 0005) no puede. Si la app copia a mano estados, etiquetas y transiciones, tarde o temprano mostrará una acción que el API rechaza, o una etiqueta distinta a la del panel.

## Decisión

Generar Dart a partir de `@chucarit/shared`:

- `pnpm --filter @chucarit/shared gen:dart` compila el paquete y ejecuta `packages/shared/scripts/generate-dart.ts`, que escribe `apps/mobile/lib/src/shared/domain.g.dart`. El render es una función pura, `renderDart()` en `packages/shared/scripts/dart.ts`.
- El archivo contiene: los enums `ReportStatus` y `Role` con el valor del API (`'in_progress'`), la etiqueta en español y `fromValue()`; los sets `finalReportStatuses`, `openReportStatuses` y `staffRoles`; la tabla `reportTransitions`, y `canTransition()` y `allowedTransitions()` con la misma semántica que en TypeScript.
- Lleva `// GENERATED FILE. DO NOT EDIT.`, `// ignore_for_file: type=lint` y `// dart format off`, para que `flutter analyze` y el `dart format --set-exit-if-changed` del lint de la app no lo toquen.
- `packages/shared/src/dart.test.ts` compara el archivo commiteado con `renderDart()` y **falla si quedó desactualizado**. Como ese archivo está fuera del paquete, `turbo.json` agrega `$TURBO_ROOT$/apps/mobile/lib/src/shared/domain.g.dart` a los `inputs` de `@chucarit/shared#test`; sin eso, Turborepo serviría el test desde caché tras una edición a mano. `pnpm --filter @chucarit/shared check:dart` hace la misma verificación desde la línea de comandos.

**Alcance:** solo constantes del dominio. Los modelos de respuesta del API (reportes, usuarios) se escriben en `apps/mobile/lib/src/features/<feature>/` y usan `ReportStatus.fromValue(...)`. Generar modelos desde OpenAPI (`@nestjs/swagger`) queda como opción futura, cuando el API tenga endpoints estables.

## Alternativas consideradas

- **Copiar a mano con una auditoría periódica** (lo que hace otro proyecto del autor). Sin herramientas, pero la desincronización se detecta tarde, en la auditoría o en producción.
- **Paquete Dart mantenido a mano.** Separa el contrato, pero sigue siendo una segunda fuente de verdad.
- **Generar todo desde OpenAPI ya.** Cubriría también los modelos, pero hoy el API no tiene endpoints de dominio; además OpenAPI no expresa la tabla de transiciones por rol, que habría que exponer aparte.

## Consecuencias

- Positivas: la tabla de transiciones tiene una sola fuente; un cambio en `packages/shared` sin regenerar rompe `pnpm test`, en local y en CI.
- Positivas: el generador es pequeño, sin dependencias, y está cubierto por tests (escapado de comillas y `$` en etiquetas).
- Negativas: hay que acordarse de correr `gen:dart`; el test avisa, pero no regenera.
- Negativas: cada constante nueva que la app necesite exige tocar `DartDomain` y `renderDart()`, no solo `packages/shared/src`.
- Negativas: los modelos de respuesta siguen escritos a mano en Dart y pueden desalinearse del API hasta que exista la generación desde OpenAPI; los cubren los tests de la app.
