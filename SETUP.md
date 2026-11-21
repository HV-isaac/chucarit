# Cómo arrancar Chucarit

El repo ya trae la configuración de Claude Code, Spec Kit y el andamiaje del monorepo. Esta guía es para levantarlo en una máquina nueva y para saber qué sigue.

## Qué hay en el repo

```
CLAUDE.md                     Contexto general: stack, dominio, flujo de Spec Kit, convenciones
apps/*/CLAUDE.md              Reglas de cada app (API, mobile, admin)
.claude/settings.json         Permisos compartidos + hook que formatea con Prettier
.claude/hooks/format.mjs      Script del hook
.claude/agents/               8 subagentes
  spec-architect.md           Revisa trabajos de Spec Kit y escribe ADRs (opus)
  api-nestjs.md               Backend (sonnet)
  db-postgis.md               Esquema, migraciones y consultas espaciales (sonnet)
  mobile-expo.md              App móvil (sonnet)
  admin-nextjs.md             Panel web (sonnet)
  devops.md                   Docker, CI/CD, Droplet, respaldos (sonnet)
  code-reviewer.md            Revisión de código, solo lectura (opus)
  security-reviewer.md        Seguridad y privacidad, solo lectura (opus)
.claude/skills/speckit-*      Skills de Spec Kit (/speckit-specify, /speckit-plan, ...)
.specify/                     Spec Kit: plantillas propias (templates/overrides), scripts, constitución
specs/                        Un trabajo por carpeta
infra/docker-compose.dev.yml  Postgres 16 + PostGIS local
```

Claude Code carga el `CLAUDE.md` de cada carpeta de `apps/` cuando trabaja en ella, así que el contexto específico solo ocupa espacio cuando hace falta.

## 1. Requisitos

- Node.js 24 (`.nvmrc`); mínimo 22
- pnpm 11: `corepack enable` (la versión exacta está en `packageManager` del `package.json`)
- Docker Desktop (Postgres + PostGIS local)
- Xcode con iOS Simulator y/o Android Studio para la app
- Spec Kit: `uv tool install specify-cli` (solo si vas a actualizar las plantillas o skills con `specify`)
- Claude Code con sesión iniciada

## 2. Instalar y levantar

```bash
pnpm install
docker compose -f infra/docker-compose.dev.yml up -d
cp apps/api/.env.example apps/api/.env
pnpm dev
```

- API: http://localhost:3100/health
- Panel: http://localhost:3200
- App: en la terminal de Metro, `i` para iOS o `a` para Android

Antes de dar algo por terminado: `pnpm lint && pnpm typecheck && pnpm test`.

## 3. Abrir Claude Code

```bash
claude
```

Revisa con `/agents` que aparezcan los 8 subagentes y escribe `/speckit` para ver las skills. La primera vez, Claude Code te pedirá confiar en la carpeta: acepta, o las reglas `allow` de `settings.json` no se aplicarán.

## 4. Siguientes pasos sugeridos

Ve en orden. Revisa y commitea después de cada paso.

**a) ADRs iniciales**

```
Usa spec-architect para escribir los ADRs iniciales: monorepo con pnpm+Turborepo,
DigitalOcean en vez de Supabase (el proyecto es de portafolio y quiero
demostrar backend e infraestructura propios), PostGIS para ubicaciones y
Spec Kit como flujo de specs.
```

**b) Primer trabajo con Spec Kit**

```
/speckit-specify report-lifecycle: máquina de estados de un reporte, historial de
transiciones y permisos por rol (ya están en CLAUDE.md)
```

Acuerda la spec y luego:

```
/speckit-plan
/speckit-tasks
Pide a spec-architect que revise el trabajo report-lifecycle.
/speckit-analyze
```

Ajusta lo necesario, crea la rama `feat/report-lifecycle` y:

```
/speckit-implement
```

Al terminar:

```
Usa code-reviewer y security-reviewer para revisar los cambios.
```

**c) CI**

```
Usa devops para crear el workflow de CI en GitHub Actions según su definición.
```

## Notas

- **Ajusta los permisos con el uso.** Si Claude Code te pide permiso para algo seguro que se repite, elige "Yes, and don't ask again": queda en `.claude/settings.local.json`, que es personal y no se sube al repo.
- **Modelos.** Los revisores y el arquitecto usan `opus` porque su trabajo es razonar; los implementadores usan `sonnet` por velocidad y costo. Cámbialo en el campo `model:` de cada agente si lo prefieres.
- **Skills de Spec Kit duplicadas.** Si tienes skills `speckit-*` globales en `~/.claude/skills/`, Claude Code puede preferirlas sobre las del repo. Hacen lo mismo y trabajan sobre el `.specify/` de este repo; las del repo están versionadas para que el proyecto sea autocontenido.
- **Nombres de carpetas.** Si cambias la estructura (por ejemplo `apps/web` en vez de `apps/admin`), actualiza los `CLAUDE.md`, los agentes y las plantillas de `.specify/templates/overrides/`, porque mencionan rutas concretas.
