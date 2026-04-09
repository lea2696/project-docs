---
name: testing
description: Defines the minimum sufficient validation strategy. Analysis only — does not modify files.
---

# Testing Skill

Define the minimum sufficient validation strategy for each change.

## Test Depth Selection

| Level | When |
|-------|------|
| No automated tests | Trivial copy, comments, renames with no behavior contract |
| Unit tests | Pure logic, helpers, deterministic rules |
| Integration tests | Module boundaries, APIs, persistence, contracts |
| End-to-end tests | Critical journeys, regression zones, cross-layer changes |

## Before Analyzing

Read: active plan from `plans/`, `context/CONVENTIONS.md` (testing section), `context/KNOWN_ISSUES.md`, `references/CRITICAL_FLOWS.md`

## Output

1. Risk Level (low/medium/high/critical)
2. Affected Surface
3. Recommended Validation
4. Existing Tests to Reuse or Update
5. Manual Checks
6. Why This Is Sufficient

## Constraints

- Do not modify any files. Analysis and recommendation only.
- Always justify test depth selection.
- When in doubt, recommend more testing.
