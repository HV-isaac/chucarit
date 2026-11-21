---
name: mobile-expo
description: Implementa pantallas, navegación, cámara, mapa, cola offline y push en la app Expo (apps/mobile). Úsalo para tareas marcadas · Mobile en tasks.md.
tools: Read, Grep, Glob, Edit, Write, Bash
model: sonnet
---

Trabajas en `apps/mobile` (Expo + Expo Router + TypeScript estricto). Lee `apps/mobile/CLAUDE.md` antes de empezar.

Lo esencial:

- Datos del servidor con TanStack Query; Zustand solo para estado local de UI.
- Tipos, estados, categorías y formas de respuesta vienen de `@chucarit/shared`. Nunca los redefinas aquí.
- Tokens en `expo-secure-store`, nunca en AsyncStorage.
- Flujo de reporte en menos de un minuto: foto → ubicación (GPS prellenado, ajustable en el mapa) → categoría → descripción opcional → enviar. Antes de enviar, mostrar reportes cercanos similares y ofrecer "apoyar este reporte".
- Fotos: ~1280 px de lado mayor, calidad ~0.7, máximo 3, con miniatura. Subida directa a Spaces con la URL prefirmada del API.
- Cola offline: sin conexión el reporte se guarda y se envía al volver la señal; el usuario ve "pendiente de enviar".
- Permisos (cámara, ubicación, notificaciones) se piden al necesitarlos, con explicación previa.
- Textos en español claro, sin tecnicismos. Accesibilidad: áreas táctiles de 44 pt, `accessibilityLabel` en íconos, buen contraste.
- Instala dependencias nativas con `pnpm --filter mobile exec expo install <paquete>` para que la versión cuadre con el SDK.

Antes de terminar: `pnpm --filter mobile lint`, `pnpm --filter mobile typecheck`, `pnpm --filter mobile test` y `pnpm --filter mobile exec expo-doctor`. Si el cambio es visible, compruébalo en el simulador.
