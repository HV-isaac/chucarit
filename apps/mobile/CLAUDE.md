# apps/mobile — Flutter

App para ciudadanos: reportar problemas y seguir su resolución. iOS y Android.

## Stack

- Flutter 3.44 / Dart 3.12, con análisis estricto (`analysis_options.yaml`).
- Navegación: `go_router` (rutas en `lib/src/router.dart`).
- Estado y datos del servidor: `flutter_riverpod` (providers por feature; nada de estado global suelto).
- HTTP: `dio`, con un interceptor que renueva el access token con el refresh token.
- Mapa: `flutter_map` con tiles gratuitos (OpenStreetMap), igual que el panel.
- Cámara y galería: `image_picker`; compresión con `flutter_image_compress` antes de subir.
- Ubicación: `geolocator`.
- Tokens en `flutter_secure_storage` (nunca en `shared_preferences`).
- Cola offline: SQLite con `drift`.
- Push: Firebase Cloud Messaging con `firebase_messaging`.

Las dependencias se agregan cuando un trabajo las necesita, no antes (hoy solo están `go_router` y `flutter_riverpod`).

## Estructura

```
lib/
  main.dart            runApp con ProviderScope
  src/
    app.dart           MaterialApp.router y tema
    router.dart        Rutas (go_router)
    shared/
      domain.g.dart    GENERADO desde packages/shared: estados, roles, transiciones
    core/              Cliente HTTP, almacenamiento seguro, permisos, formato de fechas
    features/          Una carpeta por feature (auth, report_form, my_reports, report_detail,
                       offline_queue, ...), cada una con sus pantallas, widgets y providers
test/                  Espeja la estructura de lib/
```

## El contrato con el API

- Estados, roles, etiquetas en español y la tabla de transiciones **no se escriben aquí**: salen de `lib/src/shared/domain.g.dart`, que se genera desde `packages/shared` con `pnpm --filter @chucarit/shared gen:dart`. Nunca se edita a mano; un test de `packages/shared` falla si quedó desactualizado.
- Si la app necesita una constante nueva del dominio, se agrega en `packages/shared` y se regenera.
- Los modelos de respuesta del API (reportes, usuarios) viven en `lib/src/features/<feature>/` y usan `ReportStatus.fromValue(...)` para los enums.

## Reglas de UX

- El flujo de reporte debe completarse en menos de un minuto: foto → ubicación (prellenada con GPS, ajustable en el mapa) → categoría → descripción opcional → enviar.
- Fotos: redimensionar a ~1280 px de lado mayor, calidad ~70, máximo 3 por reporte, sin metadatos EXIF de ubicación. Generar también miniatura para listas.
- **Cola offline:** si no hay conexión, el reporte se guarda localmente y se envía al recuperar señal. El usuario ve claramente "pendiente de enviar".
- Antes de enviar, mostrar reportes similares cercanos y ofrecer "apoyar este reporte" en vez de duplicarlo.
- El detalle de un reporte muestra la línea de tiempo completa de estados con fechas.
- Textos en español, claros y sin tecnicismos; muchas personas usuarias no son técnicas.
- Accesibilidad: áreas táctiles de 48 dp mínimo, `Semantics`/`tooltip` en íconos, buen contraste, respeta el tamaño de letra del sistema.
- Pedir permisos (cámara, ubicación, notificaciones) en el momento en que se necesitan, con una explicación previa.

## Comandos

```bash
cd apps/mobile && flutter run   # en simulador o dispositivo
pnpm --filter mobile lint       # dart format (sin cambios) + flutter analyze
pnpm --filter mobile test       # flutter test
flutter pub add <paquete>       # dentro de apps/mobile
```

`apps/mobile/package.json` solo existe para que Turborepo corra `lint` y `test` de Flutter junto con el resto; las dependencias de la app están en `pubspec.yaml`.
