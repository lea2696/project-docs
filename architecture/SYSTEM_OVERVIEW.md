---
status: draft
owner: human
last_updated: YYYY-MM-DD
read_policy: on-demand
---

# System Overview

> High-level architecture of the system.

## Architecture Summary

<!-- Describe the overall system architecture in 2-3 paragraphs. Cover:
- What the system does at a high level
- How it is structured (monolith, microservices, serverless, etc.)
- How data flows through the system
-->

## Components

<!-- List the major components and their responsibilities. Example:
| Component | Responsibility | Technology | Dependencies |
|-----------|---------------|------------|--------------|
| API Server | HTTP request handling, routing, auth | Express.js | Database, Cache |
| Database | Persistent storage | PostgreSQL 15 | — |
| Worker | Background job processing | Bull + Redis | Database |
-->

## Data Flow

<!-- Describe how data moves through the system from input to output. Example:
1. Client sends HTTP request to API gateway
2. Gateway validates auth token and forwards to API server
3. API server processes request, queries database
4. Response returned to client
5. Side effects published to message queue for async processing
-->

## Infrastructure

<!-- Describe deployment targets, environments, and infrastructure. Example:
- **Production**: AWS ECS Fargate, us-east-1
- **Staging**: Same architecture, separate VPC
- **Local dev**: Docker Compose with hot reload
- **CI**: GitHub Actions → build → test → deploy
-->

<!-- EXAMPLE: Filled-in system overview for a task management API

## Architecture Summary
A monolithic REST API built with Node.js and Express, backed by PostgreSQL.
The system serves a React SPA frontend and exposes a public REST API for
third-party integrations. Background jobs (email notifications, report generation)
run in a separate worker process connected to Redis.

## Components
| Component | Responsibility | Technology | Dependencies |
|-----------|---------------|------------|--------------|
| API Server | REST endpoints, auth, validation | Express.js + TypeScript | PostgreSQL, Redis |
| Worker | Email dispatch, scheduled reports | Bull queue | PostgreSQL, Redis, SMTP |
| Database | User, task, and project storage | PostgreSQL 15 | — |
| Cache | Session storage, rate limiting | Redis 7 | — |

## Data Flow
1. React SPA sends request to /api/* endpoints
2. Auth middleware validates JWT, extracts user context
3. Route handler executes business logic, queries PostgreSQL
4. Response returned as JSON
5. Write operations publish events to Redis queue
6. Worker picks up events and processes async tasks

## Infrastructure
- **Production**: Railway, auto-deploy from main branch
- **Staging**: Railway preview environments per PR
- **Local**: docker compose up (API + PostgreSQL + Redis)
- **CI**: GitHub Actions → lint → test → build → deploy
-->
