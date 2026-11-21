# apps/mobile — Expo

## Stack

- Expo (SDK estable más reciente) con Expo Router (rutas por archivos en `app/`).
- TanStack Query para datos del servidor; Zustand solo para estado local de UI si hace falta.
- Mapa: `react-native-maps`.
- Cámara y galería: `expo-image-picker`; compresión con `expo-image-manipulator` antes de subir.
- Ubicación: `expo-location`.
- Tokens en `expo-secure-store` (nunca en AsyncStorage).
- Push: `expo-notifications`.

## Estructura

```
app/                 Pantallas (Expo Router)
  (auth)/            Login, registro, verificación
  (tabs)/            Mapa, Mis reportes, Perfil
  report/new.tsx     Flujo de nuevo reporte
  report/[id].tsx    Detalle con línea de tiempo de estados
src/
  api/               Cliente HTTP y hooks de TanStack Query
  components/
  features/          Lógica por feature (report-form, offline-queue, ...)
  lib/               Utilidades (compresión de imágenes, permisos, formato de fechas)
```

## Reglas de UX

- El flujo de reporte debe completarse en menos de un minuto: foto → ubicación (prellenada con GPS, ajustable en el mapa) → categoría → descripción opcional → enviar.
- Fotos: redimensionar a ~1280 px de lado mayor, calidad ~0.7, máximo 3 por reporte. Generar también miniatura para listas.
- **Cola offline:** si no hay conexión, el reporte se guarda localmente y se envía al recuperar señal. El usuario ve claramente "pendiente de enviar".
- Antes de enviar, mostrar reportes similares cercanos y ofrecer "apoyar este reporte" en vez de duplicarlo.
- El detalle de un reporte muestra la línea de tiempo completa de estados con fechas.
- Textos en español, claros y sin tecnicismos; muchas personas usuarias no son técnicas.
- Accesibilidad: áreas táctiles de 44 pt mínimo, `accessibilityLabel` en íconos, buen contraste.
- Pedir permisos (cámara, ubicación, notificaciones) en el momento en que se necesitan, con una explicación previa.

## Tipos

Usa los tipos y esquemas de `@chucarit/shared`. No redefinir estados, categorías ni formas de respuesta del API aquí.
