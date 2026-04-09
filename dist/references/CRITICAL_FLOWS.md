---
status: draft
owner: human
last_updated: YYYY-MM-DD
read_policy: on-demand
---

# Critical Flows

> Key user journeys and system flows that require extra care when modifying.

## Flow Template

```
### [Flow Name]
**Frequency:** How often this flow executes (e.g., every request, daily, on user action)
**Last Verified:** YYYY-MM-DD
**Test Coverage:** none | partial | full

1. Step one
2. Step two
3. Step three

**Risk areas:** What can break
**Related files:** Which files are involved
```

<!-- Document critical flows as they are implemented. Example:

### User Login
**Frequency:** Every session start (~1000/day)
**Last Verified:** 2025-02-01
**Test Coverage:** full

1. User submits email + password to POST /api/auth/login
2. Server validates credentials against bcrypt hash in users table
3. Server generates JWT with user.id and role claims
4. Server sets httpOnly cookie and returns user profile
5. Client stores profile in memory, redirects to dashboard

**Risk areas:** Token expiry handling, refresh token rotation, rate limiting
**Related files:** src/routes/auth.ts, src/middleware/auth.ts, src/services/token.ts
-->
