---
status: accepted
owner: human
last_updated: 2026-04-06
read_policy: never-default
---

# ADR-002: OpenCode Support Removal

**Status:** Accepted
**Date:** 2026-04-06
**Participants:** Project maintainer

## Context

The project originally supported three AI coding frameworks: Claude Code, Codex, and OpenCode. Anthropic has been banning accounts that use Claude Code via OpenCode subscriptions, creating a compliance risk for users of this framework.

## Decision

Remove all OpenCode-specific support. Only support Claude Code and Codex natively. Add a compatibility note recommending that users of other tools (including OpenCode) follow the Codex convention (AGENTS.md + .agents/skills/).

## Consequences

- **Easier**: Fewer framework variants to maintain (2 instead of 3)
- **Easier**: Simpler documentation and onboarding
- **Harder**: OpenCode users must adapt Codex conventions manually
- **Risk mitigated**: Users won't face account bans from using this framework

## Alternatives Considered

- **Keep OpenCode support with a warning**: Rejected because it implicitly endorses a setup that risks account bans
- **Drop Codex too, Claude Code only**: Rejected because Codex provides valuable complementary capabilities
