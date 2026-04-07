---
status: draft
owner: human
last_updated: YYYY-MM-DD
read_policy: on-demand
---

# Scope

> Defines what is and is not part of this project.

## In Scope

<!-- List features, capabilities, and responsibilities this project owns. Be specific. Example:
- User authentication and session management
- CRUD operations for tasks and projects
- Role-based access control (admin, member, viewer)
-->

## Out of Scope

<!-- List what this project explicitly does NOT handle. Example:
- Email notifications (handled by notification-service)
- File storage (delegated to S3 via upload-service)
- Billing and payments
-->

## Boundaries

<!-- Define integration points and handoff boundaries with other systems. Example:
- **Auth provider**: OAuth2 tokens validated at API gateway
- **Database**: PostgreSQL via connection pool, no direct access from frontend
- **Message queue**: Publishes events to RabbitMQ, does not consume
-->

## Scope Change Process

When scope changes are proposed:
1. Document the change request in the active plan.
2. Assess impact on architecture, timeline, and dependencies.
3. Get human approval before implementation.
