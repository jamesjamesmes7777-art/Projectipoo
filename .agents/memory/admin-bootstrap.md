---
name: Admin bootstrap pattern
description: How the first authenticated user becomes the sole admin, and why it needs a DB lock.
---

# Admin bootstrap

The first authenticated user to hit an admin-gated route is auto-inserted into the
`admins` table and granted admin. There is no separate signup step.

**Why a lock is required:** the naive `count===0 → insert` check is racy. Two
brand-new users hitting admin endpoints near-simultaneously both read `count===0`
and insert *different* PKs, so `onConflictDoNothing` does NOT prevent a second
admin — you get two admins. Returning `true` unconditionally on `count===0` also
lets a losing racer get admin even when their insert didn't take.

**How to apply:** serialize the check-and-insert critical section with a
transaction-scoped advisory lock (`SELECT pg_advisory_xact_lock(<const>)`), then
inside the locked transaction: re-count; if empty, insert and return true; else
re-check this user's actual `admins` membership and return that. Authorization
must always reflect real membership, never the count snapshot. Lives in
`artifacts/api-server/src/middlewares/requireAdmin.ts`.
