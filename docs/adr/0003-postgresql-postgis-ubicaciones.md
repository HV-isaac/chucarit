# 0003. PostgreSQL + PostGIS para ubicaciones

- Estado: Aceptada
- Fecha: 2026-11-21

## Contexto

Cada reporte tiene una ubicación (GPS del teléfono, ajustable en el mapa). Sobre ella se hacen tres cosas:

1. Al crear un reporte, buscar reportes **abiertos de la misma categoría a menos de ~50 m** para sugerir «apoyar este reporte» en vez de duplicarlo.
2. Mostrar en el mapa del panel los reportes abiertos de una zona.
3. Agregar estadísticas por colonia (creados, resueltos, tiempo promedio de resolución).

Además, el cambio de estado y su historial (`report_status_history`) deben escribirse en la misma transacción, así que hace falta una base relacional con transacciones.

## Decisión

- **PostgreSQL 16 + PostGIS.** La ubicación es una columna `geography(Point, 4326)` (WGS 84, lo que entrega el GPS) con **índice GiST**.
- La búsqueda de duplicados usa `ST_DWithin(location, :point, 50)` sobre `geography`, que mide en **metros** sobre el esferoide y aprovecha el índice; se filtra por categoría y por los estados de `OPEN_REPORT_STATUSES` de `@chucarit/shared`.
- Los agregados por colonia se resuelven en SQL (con `ST_Contains` si las colonias se modelan como polígonos); el modelo exacto lo decide el trabajo de estadísticas.
- **Drizzle** define el esquema (`apps/api/src/db/schema/`) y genera migraciones (`pnpm --filter api db:generate`, en `apps/api/drizzle/`). Las consultas espaciales complejas se escriben como **SQL directo parametrizado** con la plantilla `sql` de Drizzle, nunca concatenando texto.
- En local se usa la imagen `postgis/postgis:16-3.5` con `platform: linux/amd64` (`infra/docker-compose.dev.yml`, puerto `127.0.0.1:5437`). La imagen oficial no publica arm64; forzar amd64 mantiene la misma arquitectura que CI y el Droplet. `infra/postgres/init/20-test-database.sh` crea `chucarit_test` desde `template_postgis` para los e2e.

Hoy el esquema aún no tiene tablas (`apps/api/src/db/schema/index.ts` está vacío); `GET /health` ya verifica que PostGIS responde.

## Alternativas consideradas

- **Columnas `lat`/`lng` y haversine en la aplicación.** Sin extensiones, pero sin índice espacial: para filtrar por radio hay que traer candidatos con un rectángulo aproximado y calcular en Node; los agregados por polígono serían a mano.
- **Geohash.** Indexable con un B-tree, pero las celdas no coinciden con un radio de 50 m (hay que consultar celdas vecinas y filtrar después) y no resuelve polígonos de colonias.
- **MongoDB con índices `2dsphere`.** Buen soporte de `$near`, pero pierde las transacciones relacionales y las claves foráneas entre reportes, historial, usuarios y categorías, que son el centro del dominio.

## Consecuencias

- Positivas: la regla de duplicados es una sola consulta indexada con distancia real en metros; PostGIS es estándar y fácil de defender en una entrevista.
- Positivas: estado, historial y ubicación viven en la misma transacción.
- Negativas: Drizzle no modela `geography` de forma nativa; hace falta un tipo personalizado y SQL a mano para lo espacial, que hay que cubrir con tests e2e contra PostGIS real.
- Negativas: en Apple Silicon la base corre emulada (amd64), más lenta al arrancar y en suites e2e grandes.
- Negativas: los respaldos y actualizaciones de versión deben cuidar la extensión PostGIS (misma versión al restaurar).
