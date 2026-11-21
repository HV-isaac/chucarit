# apps/api — NestJS

## Estructura

```
src/
  main.ts
  app.module.ts
  config/            Carga y validación de variables de entorno (zod)
  db/                Cliente Drizzle, esquema, migraciones
  auth/              Registro, login, refresh, guards (JwtAuthGuard, RolesGuard)
  users/
  reports/           CRUD, transiciones de estado, historial, duplicados cercanos
  categories/
  uploads/           Emisión de URLs prefirmadas para Spaces
  notifications/     Envío de push con expo-server-sdk
  stats/             Métricas de impacto (resueltos, tiempo promedio, por colonia)
  common/            Pipes (ZodValidationPipe), filtros de error, decoradores (@Roles, @CurrentUser)
test/                Tests e2e (supertest) contra una base de datos de prueba
```

## Reglas

- Un módulo por recurso. Los controladores solo validan entrada, llaman al servicio y dan forma a la respuesta; la lógica vive en servicios.
- Validación con los esquemas zod de `@chucarit/shared` mediante `ZodValidationPipe`. No declarar DTOs duplicados con class-validator.
- Toda ruta está protegida por defecto (guard global). Las públicas se marcan explícitamente con `@Public()`.
- Permisos por rol con `@Roles(...)` + `RolesGuard`. Permisos por propiedad (p. ej. "solo el autor") se validan en el servicio.
- Cambiar el estado de un reporte siempre pasa por `ReportsService.transition()`, que valida la transición con la tabla de `@chucarit/shared`, escribe el historial y dispara la notificación, todo en una transacción.
- Respuestas públicas de reportes nunca incluyen datos personales del autor. Usa serializadores distintos para ciudadano y para staff.
- Paginación por cursor en listados. Límite máximo por página.
- Rate limiting (`@nestjs/throttler`) en login, registro y creación de reportes.
- Errores con el filtro global; mensajes en español para el usuario final, sin exponer detalles internos.

## Uploads

1. El cliente pide `POST /uploads/presign` con tipo MIME y tamaño.
2. El API valida (solo `image/jpeg`, `image/png`, `image/webp`; máximo ~5 MB) y devuelve una URL prefirmada PUT que expira en pocos minutos, con una key bajo `reports/<uuid>/`.
3. El cliente sube directo a Spaces y manda las keys al crear el reporte. El API verifica que las keys existan y pertenezcan al flujo de ese usuario.

## Tests

- Unitarios para la lógica de transiciones y permisos.
- e2e por endpoint: caso feliz, sin token, rol incorrecto, recurso ajeno.
- La base de prueba se levanta con el mismo docker-compose de desarrollo y se limpia entre suites.
