# 0002. DigitalOcean (Droplet + Spaces) en vez de Supabase

- Estado: Aceptada
- Fecha: 2026-11-21

## Contexto

Chucarit necesita base de datos con consultas espaciales, autenticación con roles, almacenamiento de fotos y notificaciones push. Un BaaS como Supabase da casi todo eso listo (Postgres con PostGIS, auth, storage, políticas RLS). Pero el proyecto es de portafolio y su objetivo explícito es demostrar backend e infraestructura propios: un API con reglas de dominio claras, migraciones, despliegue, HTTPS y respaldos. Con un BaaS, la lógica de permisos quedaría repartida entre políticas RLS y el cliente, y la parte de infraestructura no se vería.

La carga esperada es la de un pueblo: cientos o pocos miles de usuarios y decenas de reportes por día. Una sola máquina sobra.

## Decisión

- **Un Droplet de DigitalOcean** con Docker Compose: el API NestJS (`apps/api`), el panel Next.js (`apps/admin`) y PostgreSQL 16 + PostGIS, detrás de **Caddy**, que obtiene y renueva certificados TLS de Let's Encrypt sin intervención. `GET /health` (`apps/api/src/health/health.controller.ts`) comprueba el API y `postgis_version()` para Caddy y el script de despliegue.
- **DigitalOcean Spaces** (S3-compatible) para las fotos. El cliente pide `POST /uploads/presign`, el API valida tipo (`image/jpeg`, `image/png`, `image/webp`) y tamaño (~5 MB) y devuelve una URL PUT prefirmada que expira en minutos, con key bajo `reports/<uuid>/`. Las fotos nunca pasan por el API.
- **GitHub Actions** para CI (lint, typecheck, tests, e2e contra PostGIS) y despliegue al Droplet; respaldos de Postgres con `pg_dump` programado hacia Spaces.

Hoy en el repo solo existe `infra/docker-compose.dev.yml` (desarrollo y e2e); el compose de producción, el `Caddyfile`, los workflows y los scripts de respaldo se agregan en el trabajo de infraestructura.

## Alternativas consideradas

- **Supabase.** Menos código y operación; PostGIS incluido. Pero auth, permisos y storage serían del proveedor, no del proyecto, y el plan gratuito pausa proyectos inactivos (aprox. una semana sin uso), mal para una demo de portafolio; el plan pagado ronda los US$25/mes (cifra aproximada).
- **Firebase.** Firestore no tiene consultas geoespaciales por radio nativas (se emulan con geohash) ni transacciones relacionales cómodas para estado + historial.
- **PaaS (Render, Railway, Fly.io).** Despliegue más simple que un Droplet, pero Postgres con PostGIS administrado suele costar aparte, los planes gratuitos duermen o expiran, y se demuestra menos de infraestructura.

## Consecuencias

- Positivas: costo fijo bajo y predecible; como referencia aproximada, un Droplet básico de 1-2 GB cuesta del orden de US$6-12/mes y Spaces unos US$5/mes con 250 GB y 1 TB de transferencia incluidos (verificar precios vigentes antes de contratar).
- Positivas: sin dependencia de un BaaS; todo el sistema corre igual en local con Docker y el código muestra auth, permisos, migraciones y despliegue.
- Negativas: la operación es propia: parches del sistema y de imágenes, rotación de secretos, monitoreo y alertas, y probar que los respaldos se restauran.
- Negativas: una sola máquina es un punto único de falla; una caída del Droplet tumba API, panel y base. Aceptable para la escala de un pueblo, con respaldos fuera de la máquina.
- Negativas: Postgres en el mismo Droplet compite por memoria con el API y el panel; si crece, el primer paso es moverlo a un Postgres administrado.
