# Project Docs — Agent-Ready Documentation System

A satellite documentation system designed to live inside any software project. It provides structured project knowledge that AI coding agents (Claude Code, Codex) consume to stay focused, coordinated, and aligned with your project's reality.

**Install it into any repo. Agents read it. Humans maintain it. Everyone stays on the same page.**

---

## Table of Contents

- [What This Is](#what-this-is)
- [How to Install](#how-to-install)
- [Documentation Structure](#documentation-structure)
- [Context Loading Policy](#context-loading-policy)
- [Agent Roles](#agent-roles)
  - [Planner](#planner)
  - [Implementer](#implementer)
  - [Tester](#tester)
  - [Reviewer](#reviewer)
  - [Docs Maintainer](#docs-maintainer)
  - [Bootstrapper](#bootstrapper)
- [Task Routing](#task-routing)
- [Conflict Resolution](#conflict-resolution)
- [Rules System (Claude Code)](#rules-system-claude-code)
- [Templates](#templates)
- [Memory System](#memory-system)
- [Conventions](#conventions)
- [Documentation Enforcement](#documentation-enforcement)
- [License](#license)
- [Espanol](#espanol)

---

## What This Is

A documentation layer that drops into any project to give AI agents structured context. Instead of agents guessing at your project's architecture, conventions, and current state, they read a well-defined set of documents.

It provides:

- **Layered documentation model** — 8 directories covering product vision, architecture, current context, references, plans, sessions, handoffs, and error memory.
- **6 explicit agent roles** — Planner, Implementer, Tester, Reviewer, Docs Maintainer, and Bootstrapper, each with exact instructions, defined output format, and scoped responsibilities.
- **Context loading policy** — 3 files are always-read, the rest are on-demand. Agents don't waste tokens loading irrelevant docs.
- **Task routing** — fast path for trivial changes, standard path for features, full path for architecture and security changes.
- **Conflict resolution** — escalation rules when agents disagree, with human intervention as the final arbiter.
- **Framework portability** — works with Claude Code (`.claude/agents/`) and Codex (`.agents/skills/`). For other AI coding tools (e.g., OpenCode), follow the Codex convention (`AGENTS.md` + `.agents/skills/`).

---

## How to Install

This repo is meant to be cloned or copied into your project's root as `project-docs/`:

```sh
# Clone directly into your project
git clone https://github.com/lea2696/project-docs.git project-docs/

# Or add as a submodule
git submodule add https://github.com/lea2696/project-docs.git project-docs/
```

After installing, run the bootstrap script to set up agent configuration:

```sh
# Run the bootstrap CLI (generates CLAUDE.md, AGENTS.md, and agent configs)
node project-docs/scripts/bootstrap.mjs

# Or with options
node project-docs/scripts/bootstrap.mjs --dry-run         # Preview changes
node project-docs/scripts/bootstrap.mjs --non-interactive  # Use defaults
```

Then run the bootstrapper agent to fill in documentation interactively:

```
# Claude Code
"Use the bootstrapper agent to initialize project docs"

# Codex
"Use the bootstrap skill to initialize project docs"
```

---

## Installation Layout

When installed in a host repo, the system uses a **two-layer layout**:

| Location | Purpose | Consumed by |
|----------|---------|-------------|
| `project-docs/` | Documentation content: product vision, architecture, context, references, plans, sessions, handoffs, memory | All agents reading project knowledge |
| `scaffold/` (inside this repo) | Templates for agent configuration files — bootstrap copies them to host repo root | Bootstrap script only |
| Host repo root: `CLAUDE.md` | Claude Code master instructions (generated from scaffold) | Claude Code |
| Host repo root: `AGENTS.md` | Agent routing policy (generated from scaffold) | Codex |
| Host repo root: `.claude/agents/` | Claude Code subagent definitions (generated from scaffold) | Claude Code |
| Host repo root: `.claude/rules/` | Claude Code rule sets (generated from scaffold) | Claude Code |
| Host repo root: `.agents/skills/` | Codex skill definitions (generated from scaffold) | Codex |

The bootstrap script (`scripts/bootstrap.mjs`) handles copying scaffold templates to the host repo root and replacing placeholders with project-specific values.

---

## Documentation Structure

```
project-docs/
├── product/
│   ├── VISION.md              # Long-term purpose, target users, value proposition
│   ├── SCOPE.md               # What's in/out of scope, boundary change process
│   └── ROADMAP.md             # Ordered work phases with status tracking
│
├── architecture/
│   ├── SYSTEM_OVERVIEW.md     # High-level system architecture and data flow
│   ├── MODULES.md             # Module inventory and relationships
│   ├── DECISIONS.md           # Architecture Decision Records index
│   ├── DEPENDENCIES.md        # External dependencies with risk profiles
│   └── decisions/             # Individual ADR files (ADR-NNN-title.md)
│
├── context/
│   ├── TECH_STACK.md          # Technology choices, versions, commands, and rationale
│   ├── CONVENTIONS.md         # Code style, naming, git, testing, doc conventions
│   ├── CURRENT_STATE.md       # What's working, in progress, and blocked
│   └── KNOWN_ISSUES.md        # Tracked bugs and fragile areas
│
├── references/
│   ├── REPO_MAP.md            # Annotated directory tree
│   ├── KEY_FILES.md           # Index of critical files and entry points
│   └── CRITICAL_FLOWS.md      # Key user journeys and system flows
│
├── plans/                     # Implementation plans (from PLAN_TEMPLATE.md)
├── sessions/                  # Work session logs (from SESSION_TEMPLATE.md)
├── handoffs/                  # Agent-to-agent transfers (from HANDOFF_TEMPLATE.md)
│
├── memory/
│   ├── RECURRING_MISTAKES.md  # Structured error patterns with root cause analysis
│   └── CHANGELOG_NOTES.md     # Significant changes with agent impact tracking
│
├── scaffold/                  # Templates for agent config (copied by bootstrap)
│   ├── CLAUDE.md.template     # Claude Code master instructions template
│   ├── AGENTS.md.template     # Codex routing policy template
│   ├── .claude/agents/        # Claude Code subagent templates (6 files)
│   ├── .claude/rules/         # Claude Code rule templates (4 files)
│   └── .agents/skills/        # Codex skill templates (6 directories)
│
└── scripts/
    ├── bootstrap.mjs          # Bootstrap CLI (copies scaffold to host repo)
    ├── bootstrap.sh           # Bash wrapper for bootstrap.mjs
    └── validate-docs.mjs      # Documentation structure validator
```

---

## Context Loading Policy

Agents follow a **minimum-context-by-default** policy:

| Category | Files | When |
|----------|-------|------|
| **Always read** | `VISION.md`, `TECH_STACK.md`, `CONVENTIONS.md` | Every task |
| **Read when relevant** | `SCOPE.md`, `ROADMAP.md`, `SYSTEM_OVERVIEW.md`, `CRITICAL_FLOWS.md`, `CURRENT_STATE.md`, `KNOWN_ISSUES.md`, active plans/sessions/handoffs | Only when the task touches those areas |
| **Never load by default** | Entire doc tree, historical sessions, completed plans | Only on explicit request |

---

## Agent Roles

Both frameworks define the same 6 roles with identical responsibilities and output formats.

### Planner

**Purpose**: Converts goals into executable implementation plans.

**Responsibilities**:
- Restate the goal in precise engineering terms
- Identify included and excluded scope
- Identify affected modules, files, and risks
- Break work into small ordered tasks
- Define human checkpoints and testing strategy
- Identify documentation files that need updating

**Output Format**:
1. Objective
2. Included Scope
3. Excluded Scope
4. Risks
5. Affected Areas
6. Ordered Tasks
7. Human Checkpoints
8. Validation Strategy
9. Documentation Updates
10. Done Criteria

**Invocation**:
- Claude Code: delegated via CLAUDE.md or `"use the planner agent"`
- Codex: `use the planning skill`

---

### Implementer

**Purpose**: Performs scoped code changes based on the active plan.

**Responsibilities**:
- Make the smallest coherent code change that satisfies the task
- Follow established project conventions
- Preserve architectural boundaries unless the plan says otherwise
- Do not expand scope without recording the reason
- Do not silently refactor unrelated files
- Stop and request support if confidence is low in a fragile area

**Output Format**:
1. Files changed
2. Behavior changed
3. Validation run
4. Risks remaining
5. Documentation touched

**Invocation**:
- Claude Code: delegated via CLAUDE.md or `"use the implementer agent"`
- Codex: `use the implementation skill`

---

### Tester

**Purpose**: Defines the minimum sufficient validation strategy for each change.

**Test Depth Selection**:
| Level | When to use |
|-------|-------------|
| **No automated tests** | Trivial copy, comments, mechanical renames with no behavior contract affected |
| **Unit tests** | Pure logic, helpers, mapping functions, deterministic business rules |
| **Integration tests** | Module boundaries, APIs, persistence, external services, contracts |
| **End-to-end tests** | Critical user journeys, historical regression zones, high-risk cross-layer changes |

**Output Format**:
1. Risk Level
2. Affected Surface
3. Recommended Validation
4. Existing Tests to Reuse or Update
5. Manual Checks
6. Why This Is Sufficient

**Invocation**:
- Claude Code: delegated via CLAUDE.md or `"use the tester agent"`
- Codex: `use the testing skill`

---

### Reviewer

**Purpose**: Reviews completed work for correctness, architecture fit, regression risk, and documentation impact.

**Rejection Conditions**:
- Changes behavior without corresponding validation or documentation
- Introduces unrelated refactors into a scoped task
- Violates architecture or conventions without an explicit decision record

**Output Format**:
1. **Verdict**: Approved, Approved With Changes, or Rejected
2. Correctness Findings
3. Architecture Findings
4. Regression Risks
5. Validation Findings
6. Documentation Findings
7. Required Follow-ups

**Invocation**:
- Claude Code: delegated via CLAUDE.md or `"use the reviewer agent"`
- Codex: `use the review skill`

---

### Docs Maintainer

**Purpose**: Keeps project documentation synchronized with reality.

**Responsibilities**:
- Update plans to reflect current implementation state
- Record session notes (what was done, what remains, open risks)
- Create handoff notes when work stops mid-stream
- Update architecture, flow, or convention docs when behavior changes
- Record recurring mistakes and decision changes

**Commit Policy**:
- Doc changes with code go in the same commit
- Pure state updates use separate `docs:` prefixed commits
- One commit per Architecture Decision Record
- Session/handoff notes committed at end of session

**Output Format**:
1. Files Updated
2. State Changes Recorded
3. Remaining Gaps
4. Recommended Next Document to Read

**Invocation**:
- Claude Code: delegated via CLAUDE.md or `"use the docs-maintainer agent"`
- Codex: `use the documentation skill`

---

### Bootstrapper

**Purpose**: Initializes project documentation interactively after installation.

**Process**:
1. Asks about project name, purpose, target users, tech stack, conventions, and current state
2. Generates initial content for the 3 always-read files (VISION.md, TECH_STACK.md, CONVENTIONS.md)
3. Optionally populates SCOPE.md, SYSTEM_OVERVIEW.md, and REPO_MAP.md
4. Verifies by reading back generated files and confirming with the user

**Rules**: Does not invent information. Does not fill speculative content. Asks clarifying questions rather than guessing.

**Output Format**:
1. Files created or updated
2. Sections left as TODO (with reason)
3. Suggested next steps

**Invocation**:
- Claude Code: `"use the bootstrapper agent to initialize project docs"`
- Codex: `use the bootstrap skill`

---

## Task Routing

Not every change needs the full pipeline:

| Path | Roles Used | When to Use |
|------|-----------|-------------|
| **Fast path** | Implementer only | Typo fixes, comment corrections, formatting, config changes with no behavior impact, patch-level dependency bumps |
| **Standard path** | Planner → Implementer → Tester → Reviewer | New features, bug fixes, refactors, behavior changes, test infrastructure changes |
| **Full path** | All roles + human checkpoints | Architecture changes, new modules/services, security/auth/billing changes, database migrations, multi-module changes, destructive operations |

**When in doubt, use the standard path.**

---

## Conflict Resolution

- **Plan deviation**: If the Implementer needs to deviate from the plan, it must document the deviation in the plan's Deviations section and pause for human review.
- **Repeated rejection**: If the Reviewer rejects work twice consecutively on the same task, the workflow escalates to the human for a decision.
- **Ambiguity**: Any agent facing ambiguity, contradictory requirements, or situations outside its scope must pause and request human intervention.
- **Architectural disagreements**: Never resolved autonomously between agents — always escalated to the human.

---

## Rules System (Claude Code)

Claude Code uses a separate rules directory (`.claude/rules/`) with 4 rule sets:

| Rule Set | File | Covers |
|----------|------|--------|
| **General** | `.claude/rules/general.md` | Core principles, human checkpoints, context discipline, conflict resolution, dependency management |
| **Testing** | `.claude/rules/testing.md` | Validation strategy, test depth selection |
| **Review** | `.claude/rules/review.md` | Review criteria, rejection conditions, approval requirements |
| **Documentation** | `.claude/rules/documentation.md` | When/how to update docs, commit policy, end-of-session protocol |

Codex embeds equivalent rules in its `AGENTS.md` and skill definitions.

---

## Templates

| Template | Location | Sections |
|----------|----------|----------|
| **Plan** | `plans/PLAN_TEMPLATE.md` | Objective, Included Scope, Excluded Scope, Risks, Ordered Steps, Human Checkpoints, Validation Strategy, Deviations, Documentation Updates, Done Criteria |
| **Session** | `sessions/SESSION_TEMPLATE.md` | Objective, Work Performed, Decisions Made, Blockers, Next Steps, Compliance Checklist |
| **Handoff** | `handoffs/HANDOFF_TEMPLATE.md` | Context Summary, Current State, Open Questions, Recommended Next Action |

---

## Memory System

### Recurring Mistakes (`memory/RECURRING_MISTAKES.md`)

Structured entries for patterns that caused problems:

```
### MIS-NNN: [Title]
- Date:
- Category: testing | architecture | conventions | performance | security | dependencies
- What happened:
- Root cause:
- Resolution:
- Prevention rule:
- References:
```

### Changelog Notes (`memory/CHANGELOG_NOTES.md`)

Table tracking significant changes with an **Agent Impact** column describing what agents must do differently as a result.

---

## Conventions

Key conventions enforced by this system (details in `context/CONVENTIONS.md`):

- **Session tracking**: Every work session produces a session note with a compliance checklist
- **Documentation commits**: Doc changes with code = same commit. Pure state updates = `docs:` prefix. One commit per ADR.
- **Plan discipline**: Plans committed on status change. Deviations recorded in-plan and require human approval.

---

## Documentation Enforcement

The framework includes automated enforcement to prevent agents from skipping documentation updates.

### Three Layers

| Layer | Mechanism | When it fires |
|-------|-----------|---------------|
| **Validator** | `node scripts/validate-docs.mjs --strict` | On demand or via hooks |
| **Pre-commit hook** | Claude Code `settings.json` hook matching `git commit` | Every commit by the agent |
| **CI** | GitHub Actions `docs-lint.yml` | Every push/PR to main |

### What `--strict` Checks

- **Placeholder detection**: Required content files (VISION.md, CURRENT_STATE.md, TECH_STACK.md, CONVENTIONS.md, KNOWN_ISSUES.md) must not contain template placeholder content
- **Date validation**: Frontmatter `last_updated` must be a valid ISO date, not `YYYY-MM-DD` placeholder
- **Session activity**: If 5+ commits exist with no session notes, the validator blocks
- **Init grace period**: Repos with fewer than 3 commits skip content checks (allows initial bootstrap)

### How Blocking Works

The pre-commit hook uses Claude Code's `PreToolUse` event to intercept `git commit` commands. If `--strict` validation fails (exit code 2), the commit is rejected and the agent sees the error output. The agent must fix the documentation issues before retrying.

---

## License

MIT

---

# Espanol

# Project Docs — Sistema de Documentacion para Agentes

Un sistema de documentacion satelite disenado para vivir dentro de cualquier proyecto de software. Provee conocimiento estructurado del proyecto que los agentes de IA (Claude Code, Codex) consumen para mantenerse enfocados, coordinados y alineados con la realidad del proyecto.

**Instalalo en cualquier repo. Los agentes lo leen. Los humanos lo mantienen. Todos en la misma pagina.**

---

## Que es esto

Una capa de documentacion que se instala en cualquier proyecto para darle a los agentes de IA contexto estructurado. En vez de que los agentes adivinen tu arquitectura, convenciones y estado actual, leen un conjunto bien definido de documentos.

Provee:

- **Modelo de documentacion por capas** — 8 directorios cubriendo vision de producto, arquitectura, contexto actual, referencias, planes, sesiones, handoffs y memoria de errores.
- **6 roles de agente explicitos** — Planner, Implementer, Tester, Reviewer, Docs Maintainer y Bootstrapper, cada uno con instrucciones exactas, formato de salida definido y responsabilidades acotadas.
- **Politica de carga de contexto** — 3 archivos son always-read, el resto es on-demand. Los agentes no desperdician tokens cargando docs irrelevantes.
- **Enrutamiento de tareas** — fast path para cambios triviales, standard path para features, full path para cambios de arquitectura y seguridad.
- **Resolucion de conflictos** — reglas de escalacion cuando los agentes no coinciden, con intervencion humana como arbitro final.
- **Portabilidad de framework** — funciona con Claude Code (`.claude/agents/`) y Codex (`.agents/skills/`). Para otros tools de IA (ej. OpenCode), seguir la convencion de Codex (`AGENTS.md` + `.agents/skills/`).

---

## Como Instalar

Este repo esta pensado para ser clonado o copiado en el root de tu proyecto como `project-docs/`:

```sh
# Clonar directamente en tu proyecto
git clone https://github.com/lea2696/project-docs.git project-docs/

# O agregar como submodulo
git submodule add https://github.com/lea2696/project-docs.git project-docs/
```

Despues de instalar, ejecuta el script de bootstrap para configurar los agentes:

```sh
# Ejecuta el bootstrap CLI (genera CLAUDE.md, AGENTS.md y configs de agentes)
node project-docs/scripts/bootstrap.mjs

# O con opciones
node project-docs/scripts/bootstrap.mjs --dry-run         # Vista previa
node project-docs/scripts/bootstrap.mjs --non-interactive  # Usar defaults
```

Luego ejecuta el agente bootstrapper para llenar la documentacion interactivamente:

```
# Claude Code
"Usa el agente bootstrapper para inicializar los docs del proyecto"

# Codex
"Usa el skill de bootstrap para inicializar los docs del proyecto"
```

---

## Layout de Instalacion

Cuando se instala en un repo anfitrion, el sistema usa un **layout de dos capas**:

| Ubicacion | Proposito | Consumido por |
|-----------|-----------|---------------|
| `project-docs/` | Contenido de documentacion: vision, arquitectura, contexto, referencias, planes, sesiones, handoffs, memoria | Todos los agentes |
| `scaffold/` (en este repo) | Templates de configuracion de agentes — bootstrap los copia al root del host | Solo el script de bootstrap |
| Root del host: `CLAUDE.md` | Instrucciones master de Claude Code (generado desde scaffold) | Claude Code |
| Root del host: `AGENTS.md` | Politica de enrutamiento de agentes (generado desde scaffold) | Codex |
| Root del host: `.claude/agents/` | Definiciones de subagentes Claude Code (generado desde scaffold) | Claude Code |
| Root del host: `.claude/rules/` | Reglas de Claude Code (generado desde scaffold) | Claude Code |
| Root del host: `.agents/skills/` | Definiciones de skills Codex (generado desde scaffold) | Codex |

El script de bootstrap (`scripts/bootstrap.mjs`) se encarga de copiar los templates del scaffold al root del repo anfitrion y reemplazar placeholders con valores del proyecto.

---

## Estructura de Documentacion

```
project-docs/
├── product/
│   ├── VISION.md              # Proposito, usuarios target, propuesta de valor
│   ├── SCOPE.md               # Que esta dentro/fuera de scope, proceso de cambio
│   └── ROADMAP.md             # Fases de trabajo ordenadas con tracking de estado
│
├── architecture/
│   ├── SYSTEM_OVERVIEW.md     # Arquitectura de alto nivel y flujo de datos
│   ├── MODULES.md             # Inventario de modulos y relaciones
│   ├── DECISIONS.md           # Indice de Architecture Decision Records
│   ├── DEPENDENCIES.md        # Dependencias externas con perfiles de riesgo
│   └── decisions/             # Archivos ADR individuales (ADR-NNN-titulo.md)
│
├── context/
│   ├── TECH_STACK.md          # Tecnologias, versiones, comandos y justificacion
│   ├── CONVENTIONS.md         # Estilo de codigo, naming, git, testing, docs
│   ├── CURRENT_STATE.md       # Que funciona, en progreso, bloqueado
│   └── KNOWN_ISSUES.md        # Bugs trackeados y areas fragiles
│
├── references/
│   ├── REPO_MAP.md            # Arbol de directorios anotado
│   ├── KEY_FILES.md           # Indice de archivos criticos y entry points
│   └── CRITICAL_FLOWS.md      # Journeys de usuario y flujos del sistema
│
├── plans/                     # Planes de implementacion (desde PLAN_TEMPLATE.md)
├── sessions/                  # Logs de sesion (desde SESSION_TEMPLATE.md)
├── handoffs/                  # Transferencias entre agentes (desde HANDOFF_TEMPLATE.md)
│
├── memory/
│   ├── RECURRING_MISTAKES.md  # Patrones de error con analisis de causa raiz
│   └── CHANGELOG_NOTES.md     # Cambios significativos con tracking de impacto
│
├── scaffold/                  # Templates de config de agentes (copiados por bootstrap)
│   ├── CLAUDE.md.template     # Template de instrucciones master Claude Code
│   ├── AGENTS.md.template     # Template de politica de enrutamiento Codex
│   ├── .claude/agents/        # Templates de subagentes Claude Code (6 archivos)
│   ├── .claude/rules/         # Templates de reglas Claude Code (4 archivos)
│   └── .agents/skills/        # Templates de skills Codex (6 directorios)
│
└── scripts/
    ├── bootstrap.mjs          # Bootstrap CLI (copia scaffold al repo host)
    ├── bootstrap.sh           # Wrapper bash para bootstrap.mjs
    └── validate-docs.mjs      # Validador de estructura de documentacion
```

---

## Politica de Carga de Contexto

Los agentes siguen una politica de **contexto minimo por defecto**:

| Categoria | Archivos | Cuando |
|-----------|----------|--------|
| **Siempre leer** | `VISION.md`, `TECH_STACK.md`, `CONVENTIONS.md` | Cada tarea |
| **Leer cuando sea relevante** | `SCOPE.md`, `ROADMAP.md`, `SYSTEM_OVERVIEW.md`, `CRITICAL_FLOWS.md`, `CURRENT_STATE.md`, `KNOWN_ISSUES.md`, planes/sesiones/handoffs activos | Solo cuando la tarea toca esas areas |
| **Nunca cargar por defecto** | Arbol completo de docs, sesiones historicas, planes completados | Solo por pedido explicito |

---

## Roles de Agentes

Los 6 roles son identicos en ambos frameworks.

### Planner
**Proposito**: Convierte objetivos en planes de implementacion ejecutables.
**Salida**: Objetivo, Scope, Riesgos, Tareas Ordenadas, Checkpoints Humanos, Estrategia de Validacion, Criterios de Completitud.
**Invocacion**: Claude Code: `"usa el agente planner"` | Codex: `usa el skill de planning`

### Implementer
**Proposito**: Realiza cambios de codigo acotados segun el plan activo.
**Salida**: Archivos cambiados, Comportamiento cambiado, Validacion ejecutada, Riesgos restantes, Documentacion tocada.
**Invocacion**: Claude Code: `"usa el agente implementer"` | Codex: `usa el skill de implementation`

### Tester
**Proposito**: Define la estrategia de validacion minima suficiente.
**Niveles**: Sin tests (trivial) → Unit (logica pura) → Integration (limites de modulos) → E2E (journeys criticos).
**Salida**: Nivel de Riesgo, Superficie Afectada, Validacion Recomendada, Tests a Reusar, Checks Manuales.
**Invocacion**: Claude Code: `"usa el agente tester"` | Codex: `usa el skill de testing`

### Reviewer
**Proposito**: Revisa por correctitud, fit arquitectonico, riesgo de regresion e impacto en docs.
**Rechaza si**: cambia comportamiento sin validacion, introduce refactors no relacionados, viola arquitectura sin decision record.
**Salida**: Veredicto (Aprobado/Aprobado con Cambios/Rechazado), Hallazgos, Seguimientos.
**Invocacion**: Claude Code: `"usa el agente reviewer"` | Codex: `usa el skill de review`

### Docs Maintainer
**Proposito**: Mantiene la documentacion sincronizada con la realidad.
**Politica de commits**: Docs con codigo = mismo commit. Estado puro = `docs:` prefix. Un commit por ADR.
**Salida**: Archivos Actualizados, Cambios de Estado, Gaps Restantes, Proximo Doc Recomendado.
**Invocacion**: Claude Code: `"usa el agente docs-maintainer"` | Codex: `usa el skill de documentation`

### Bootstrapper
**Proposito**: Inicializa documentacion interactivamente despues de la instalacion.
**Proceso**: Pregunta sobre el proyecto → Genera VISION.md, TECH_STACK.md, CONVENTIONS.md → Opcionalmente llena SCOPE.md, SYSTEM_OVERVIEW.md, REPO_MAP.md → Verifica con el usuario.
**Invocacion**: Claude Code: `"usa el agente bootstrapper"` | Codex: `usa el skill de bootstrap`

---

## Enrutamiento de Tareas

| Path | Roles | Cuando |
|------|-------|--------|
| **Fast path** | Solo Implementer | Typos, formato, config sin impacto, bumps patch |
| **Standard path** | Planner → Implementer → Tester → Reviewer | Features, bug fixes, refactors, cambios de comportamiento |
| **Full path** | Todos + checkpoints humanos | Arquitectura, seguridad, auth, billing, migraciones, operaciones destructivas |

**En caso de duda, usar el standard path.**

---

## Resolucion de Conflictos

- **Desviacion del plan**: Documentar en seccion Deviations, pausar para review humano.
- **Rechazo repetido**: 2 rechazos consecutivos → escalar al humano.
- **Ambiguedad**: Pausar y pedir intervencion humana.
- **Desacuerdos arquitectonicos**: Siempre escalar al humano.

---

## Sistema de Reglas (Claude Code)

| Conjunto | Archivo | Cubre |
|----------|---------|-------|
| **General** | `.claude/rules/general.md` | Principios, checkpoints, contexto, conflictos, dependencias |
| **Testing** | `.claude/rules/testing.md` | Estrategia de validacion, profundidad de test |
| **Review** | `.claude/rules/review.md` | Criterios de review, rechazo, aprobacion |
| **Documentation** | `.claude/rules/documentation.md` | Actualizacion de docs, commits, fin de sesion |

---

## Templates

| Template | Ubicacion | Secciones |
|----------|-----------|-----------|
| **Plan** | `plans/PLAN_TEMPLATE.md` | Objetivo, Scope, Riesgos, Pasos, Checkpoints, Validacion, Desviaciones, Docs, Completitud |
| **Sesion** | `sessions/SESSION_TEMPLATE.md` | Objetivo, Trabajo, Decisiones, Bloqueantes, Proximos Pasos, Compliance |
| **Handoff** | `handoffs/HANDOFF_TEMPLATE.md` | Contexto, Estado, Preguntas Abiertas, Proxima Accion |

---

## Sistema de Memoria

**Errores Recurrentes** (`memory/RECURRING_MISTAKES.md`): Entradas con Date, Category, What happened, Root cause, Resolution, Prevention rule, References.

**Changelog** (`memory/CHANGELOG_NOTES.md`): Tabla con Date, Change, Affected Areas, Reason, Agent Impact.

---

## Enforcement de Documentacion

El framework incluye enforcement automatizado para prevenir que los agentes se salten actualizaciones de documentacion.

### Tres Capas

| Capa | Mecanismo | Cuando se ejecuta |
|------|-----------|-------------------|
| **Validador** | `node scripts/validate-docs.mjs --strict` | On demand o via hooks |
| **Hook pre-commit** | Hook de Claude Code `settings.json` que intercepta `git commit` | Cada commit del agente |
| **CI** | GitHub Actions `docs-lint.yml` | Cada push/PR a main |

### Que Valida `--strict`

- **Deteccion de placeholders**: Los archivos requeridos (VISION.md, CURRENT_STATE.md, TECH_STACK.md, CONVENTIONS.md, KNOWN_ISSUES.md) no deben contener contenido placeholder de template
- **Validacion de fechas**: El `last_updated` del frontmatter debe ser una fecha ISO valida, no el placeholder `YYYY-MM-DD`
- **Actividad de sesiones**: Si existen 5+ commits sin session notes, el validador bloquea
- **Periodo de gracia inicial**: Repos con menos de 3 commits omiten checks de contenido (permite bootstrap inicial)

### Como Funciona el Bloqueo

El hook pre-commit usa el evento `PreToolUse` de Claude Code para interceptar comandos `git commit`. Si la validacion `--strict` falla (exit code 2), el commit se rechaza y el agente ve el output de error. El agente debe arreglar los problemas de documentacion antes de reintentar.

---

## Licencia

MIT
