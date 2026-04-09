# Testing Rules

## Test Depth Selection

| Level | When to use |
|-------|-------------|
| No automated tests | Trivial copy, comments, mechanical renames with no behavior contract affected |
| Unit tests | Pure logic, helpers, mapping functions, deterministic business rules |
| Integration tests | Module boundaries, APIs, persistence, external services, contracts |
| End-to-end tests | Critical user journeys, historical regression zones, high-risk cross-layer changes |

## Guidelines

- Always justify the selected test depth
- When in doubt, test more rather than less
- Reuse existing test infrastructure before creating new utilities
- Name tests descriptively: what is being tested and what the expected outcome is
- Place tests in the project's established test directory
