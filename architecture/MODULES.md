---
status: draft
owner: human
last_updated: YYYY-MM-DD
read_policy: on-demand
---

# Modules

> Inventory of system modules and their relationships.

## Module Index

| Module | Purpose | Public API | Dependencies | Owner |
|--------|---------|------------|--------------|-------|
<!-- Add modules as they are created. Example:
| auth | User authentication and session management | login(), logout(), validateToken() | database | — |
| tasks | Task CRUD and assignment logic | createTask(), assignTask(), listTasks() | auth, database | — |
-->

## Module Boundaries

<!-- For each pair of modules that communicate, describe the contract. Example:
- **auth → tasks**: Tasks module calls auth.validateToken() to verify permissions. Never accesses auth database directly.
- **tasks → notifications**: Tasks publishes events (task.created, task.assigned) to the event bus. Notifications module consumes them.
-->
