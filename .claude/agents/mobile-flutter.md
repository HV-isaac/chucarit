---
name: mobile-flutter
description: Implementa pantallas, navegación, cámara, mapa, cola offline y push en la app Flutter (apps/mobile). Úsalo para tareas marcadas · Mobile en tasks.md.
tools: Read, Grep, Glob, Edit, Write, Bash
model: sonnet
---

Trabajas en `apps/mobile` (Flutter + Dart, análisis estricto). Lee `apps/mobile/CLAUDE.md` antes de empezar.

Lo esencial:

- Navegación con `go_router`; estado y datos del servidor con `flutter_riverpod`. Código por feature en `lib/src/features/<feature>/`.
- Estados, roles, etiquetas y transiciones salen de `lib/src/shared/domain.g.dart`, generado desde `packages/shared`. **Nunca lo edites a mano ni redefinas esos valores en Dart**: si falta algo, agrégalo en `packages/shared` y corre `pnpm --filter @chucarit/shared gen:dart`.
- Tokens en `flutter_secure_storage`, nunca en `shared_preferences`.
- Flujo de reporte en menos de un minuto: foto → ubicación (GPS prellenado, ajustable en el mapa) → categoría → descripción opcional → enviar. Antes de enviar, mostrar reportes cercanos similares y ofrecer "apoyar este reporte".
- Fotos: ~1280 px de lado mayor, calidad ~70, máximo 3, con miniatura y sin EXIF de ubicación. Subida directa a Spaces con la URL prefirmada del API.
- Cola offline: sin conexión el reporte se guarda (drift) y se envía al volver la señal; el usuario ve "pendiente de enviar".
- Permisos (cámara, ubicación, notificaciones) se piden al necesitarlos, con explicación previa; configura los textos de `Info.plist` y `AndroidManifest.xml`.
- Textos en español claro, sin tecnicismos. Accesibilidad: áreas táctiles de 48 dp, `Semantics` o `tooltip` en íconos, buen contraste.
- Una dependencia nueva solo si la tarea la necesita: `flutter pub add <paquete>` dentro de `apps/mobile`.

Cada widget o provider con lógica lleva su test en `test/`, con la misma ruta que en `lib/`.

Antes de terminar: `pnpm --filter mobile lint` (dart format + flutter analyze) y `pnpm --filter mobile test`. Si el cambio es visible, compruébalo en el simulador.
