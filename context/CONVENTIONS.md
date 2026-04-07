---
status: active
owner: human
last_updated: YYYY-MM-DD
read_policy: always
---

# Conventions

> Project-wide coding and workflow conventions.

## Code Style

<!-- Specify linter, formatter, and style guide. Example:
- **Linter**: ESLint with @typescript-eslint
- **Formatter**: Prettier (printWidth: 100, singleQuote: true, trailingComma: all)
- **Style guide**: Airbnb base
-->

## Naming Conventions

<!-- Define naming patterns. Example:
- **Files**: kebab-case (e.g., `user-service.ts`)
- **Variables/functions**: camelCase
- **Classes/types**: PascalCase
- **Constants**: UPPER_SNAKE_CASE
- **Database tables**: snake_case plural (e.g., `user_sessions`)
-->

## File Organization

<!-- Describe the expected directory structure for application code. Example:
- `src/routes/` — HTTP route handlers
- `src/services/` — Business logic
- `src/models/` — Database models and types
- `src/middleware/` — Express middleware
- `src/utils/` — Shared utilities
-->

## Git Conventions

- **Branch naming:** `type/short-description` (e.g., `feat/user-auth`, `fix/login-redirect`)
- **Commit format:** imperative mood, concise subject line
- **PR process:** description required, link to plan or task

## Testing Conventions

<!-- Define where tests live, naming patterns, and coverage expectations. Example:
- Tests live in `tests/` mirroring `src/` structure
- Test files named `*.test.ts`
- Minimum coverage: 80% for business logic modules
- Integration tests use test database (not mocks)
-->

## Documentation Conventions

- Update documentation when behavior, architecture, contracts, or workflows change.
- Keep documents concise and navigable.
- Use templates from `project-docs/plans/`, `sessions/`, and `handoffs/`.

## Session Tracking

- Every work session must produce a session note using `sessions/SESSION_TEMPLATE.md`.
- Each session note must list which documentation files were read during the session.
- Each session note must complete the compliance checklist before closing.

## Documentation Commits

- Documentation changes that accompany code changes go in the same commit as the code.
- Pure state updates (CURRENT_STATE.md, ROADMAP.md status changes) go in separate commits with prefix `docs:`.
- Architecture Decision Records (DECISIONS.md entries) are committed atomically — one commit per ADR.
- Session notes and handoff notes are committed at end of session, not during active work.
- Plan files are committed when status changes (Draft → Active, Active → Completed).
