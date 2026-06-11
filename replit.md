# OmniTradeX

A SpaceX share-certificate verification platform. The public can verify an issued certificate by its reference number; admins manage certificates (create, edit, approve/reject/revoke, delete) behind authenticated login.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server
- `pnpm --filter @workspace/omnitradex run dev` — run the web frontend
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only; prompts for destructive changes)
- Required env: `DATABASE_URL` — Postgres connection string; `SESSION_SECRET`

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Auth: Replit Auth (OpenID Connect via `openid-client`), session-cookie based
- Frontend: React 19 + Vite + Tailwind v3 + wouter (ported verbatim from a Bolt export)
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)

## Where things live

- DB schema (source of truth): `lib/db/src/schema/{auth,certificates,auditLogs,admins}.ts` + barrel `lib/db/src/schema/index.ts`
- API contract (auth only): `lib/api-spec/openapi.yaml` → generated hooks/Zod in `lib/api-client-react`
- Backend: `artifacts/api-server/src/` — `app.ts` (middleware wiring), `routes/{index,auth,certificates,admin}.ts`, `middlewares/{authMiddleware,requireAdmin}.ts`, `lib/{auth,audit}.ts`
- Frontend: `artifacts/omnitradex/src/` — `lib/certificates.ts` (API client), `components/{AdminPage,AdminLogin,AdminDashboard}.tsx`
- Original Bolt export (reference): `attached_assets/project-bolt-extracted/project/`

## Architecture decisions

- Certificate endpoints are validated with `drizzle-zod` schemas and are intentionally NOT in the OpenAPI spec; only auth endpoints are codegen'd. The frontend calls `/api/...` with absolute paths (the shared proxy routes `/api` most-specific-first), `credentials: "include"`.
- Admin bootstrap: the first authenticated user to hit an admin route becomes the sole admin. This is serialized with a transaction-scoped Postgres advisory lock (`pg_advisory_xact_lock`) so exactly one admin can ever be created and authorization always reflects actual `admins` membership.
- Public verify returns a certificate only when `approval_status = 'APPROVED'`; otherwise `{ certificate: null }`.
- Money fields (`allocation_price`, `total_consideration`) use `doublePrecision` (not `numeric`) so Drizzle returns JS numbers the ported frontend expects.

## Product

- Public: verify a certificate by reference number (`/api/certificates/verify/:ref`).
- Admin (authenticated): list/create/update certificates, run approval transitions, delete; all mutations write to `audit_logs`.

## User preferences

- The admin login UI must not contain any "Replit" wording (single neutral "Sign In" button), even though auth is backed by Replit Auth.
- Migrate/port faithfully: preserve the existing Bolt UI verbatim; no scope creep beyond the requested migration.

## Gotchas

- `drizzle-kit push` prompts interactively for destructive changes (e.g. adding a UNIQUE constraint to a populated table) and fails in the non-TTY shell. For safe constraint additions on existing data, apply the DDL directly via SQL rather than `push-force`.
- Do not change the OpenAPI `info.title` — it controls generated filenames.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
