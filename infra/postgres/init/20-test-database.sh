#!/bin/bash
# Creates the e2e test database next to the development one, both with PostGIS.
# The postgis/postgis image already enables PostGIS in POSTGRES_DB and template_postgis.
set -euo pipefail

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-SQL
  CREATE DATABASE chucarit_test TEMPLATE template_postgis OWNER "$POSTGRES_USER";
SQL
