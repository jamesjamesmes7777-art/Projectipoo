---
name: drizzle-kit push needs a TTY for destructive changes
description: Why `db push` fails in the agent shell and how to apply safe DDL instead.
---

# drizzle-kit push in a non-TTY shell

`pnpm --filter @workspace/db run push` (and `push-force`) renders an interactive
prompt whenever drizzle considers a change potentially destructive — e.g. adding a
`UNIQUE` constraint to an already-populated table ("Do you want to truncate?"). The
agent shell is non-TTY, so it errors with `Interactive prompts require a TTY
terminal` and applies nothing. `push-force` does NOT skip these prompts.

**How to apply:** for safe, well-understood constraint/default additions on a table
that already has data, run the DDL directly via SQL (e.g. `ALTER TABLE ... ADD
CONSTRAINT ...`) instead of fighting the prompt. Postgres does not support
`IF NOT EXISTS` on `ADD CONSTRAINT`, so only run each once. Keep the Drizzle schema
in sync so future diffs are clean.
