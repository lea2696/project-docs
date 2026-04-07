---
status: accepted
owner: human
last_updated: 2026-04-06
read_policy: never-default
---

# ADR-001: Two-Layer Scaffold Architecture

**Status:** Accepted
**Date:** 2026-04-06
**Participants:** Project maintainer, Codex review

## Context

Agent configuration files (CLAUDE.md, AGENTS.md, .claude/agents/, .agents/skills/) must live in the host repo root for Claude Code and Codex to autodiscover them. However, project-docs installs as a subdirectory. We needed a way to deliver agent configs to the host repo root while keeping templates maintainable in this repo.

## Decision

Use a two-layer architecture:
1. `scaffold/` directory contains template files with `{{PLACEHOLDER}}` variables
2. `scripts/bootstrap.mjs` copies scaffold files to host repo root, replacing variables
3. This repo also uses its own system (dogfooding) with concrete agent configs at the root

## Consequences

- **Easier**: Clear separation between template content and project-specific content
- **Easier**: Bootstrap script handles all setup automatically
- **Harder**: Must maintain scaffold and dogfood versions in parallel
- **Harder**: CI must verify scaffold/dogfood structural alignment

## Alternatives Considered

- **Single-layer (agent configs inside project-docs/)**: Rejected because agents can't autodiscover files in subdirectories
- **Symlinks from root to project-docs/**: Rejected because git submodules don't support cross-directory symlinks reliably
