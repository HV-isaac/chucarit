# 0005. Flutter para la app de ciudadanos

- Estado: Aceptada
- Fecha: 2026-11-21

## Contexto

La app de ciudadanos (`apps/mobile`) corre en iOS y Android y debe permitir reportar con foto y ubicación en menos de un minuto, aun sin señal (cola offline), con mapa y notificaciones push. El andamiaje inicial se hizo con Expo (React Native), que habría permitido importar `@chucarit/shared` directamente. El autor domina Flutter por otro proyecto y decidió cambiar: rinde más en un stack que ya conoce a fondo, y una app nativa compilada con buen soporte offline es defendible en un portafolio.

## Decisión

La app se escribe en **Flutter 3.44 / Dart 3.12** con análisis estricto (`apps/mobile/analysis_options.yaml`). Stack, anotado en `apps/mobile/CLAUDE.md`: `go_router` (navegación), `flutter_riverpod` (estado), `dio` (HTTP con renovación de token), `flutter_map` con tiles de OpenStreetMap, `image_picker` + `flutter_image_compress`, `geolocator`, `drift` (SQLite) para la cola offline, `flutter_secure_storage` para tokens y `firebase_messaging` para push. Las dependencias se agregan cuando un trabajo las necesita; hoy solo están `go_router` y `flutter_riverpod`.

La app se integra al monorepo con `apps/mobile/package.json`, que expone `lint` y `test` de Flutter a Turborepo (ver 0001).

## Alternativas consideradas

- **Expo / React Native.** Compartiría los tipos y esquemas zod de `@chucarit/shared` sin generación de código y usaría Expo Push. Se descartó por dominio del stack: el autor es más productivo y escribe código de más calidad en Flutter.
- **Apps nativas (Swift y Kotlin).** Mejor integración con cada plataforma, pero dos bases de código para una sola persona.

## Consecuencias

- Positivas: una base de código para iOS y Android, rendimiento nativo y un stack conocido a fondo; `drift` da una cola offline tipada y probada.
- Negativas: la app no puede importar `@chucarit/shared` (TypeScript). Estados, roles y transiciones llegan como Dart generado (ver 0006); los modelos de respuesta se escriben a mano en Dart.
- Negativas: push con **Firebase Cloud Messaging** en lugar de Expo Push: proyecto de Firebase, `google-services.json` y llave APNs, y `firebase-admin` en el API (`apps/api/src/notifications/`).
- Negativas: el CI necesitará el SDK de Flutter además de Node y pnpm, y Turborepo no entiende `pubspec.lock` (ver 0001).
- Negativas: hoy Flutter 3.44 no detecta los simuladores de iOS 27 y `flutter build ios --simulator` falla con Xcode 27 (el `lipo` de Xcode 27 ya no acepta dos arquitecturas en `-verify_arch`). Mientras Flutter no lo corrija se compila con `xcodebuild` para un simulador concreto, según el procedimiento de `apps/mobile/CLAUDE.md`. El deployment target de iOS es 15.0, porque Xcode 27 ya no compila para iOS 13.
