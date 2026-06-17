---
name: DB push TTY requirement
description: drizzle-kit push (and push-force) require a TTY when it needs to prompt about column conflicts — use executeSql instead.
---

The rule: When adding new DB tables in this project, use `executeSql` in code_execution to run `CREATE TABLE IF NOT EXISTS` directly rather than `pnpm --filter @workspace/db run push`.

**Why:** drizzle-kit push requires an interactive TTY to resolve column conflicts. When run from the agent shell (non-TTY), it throws "Interactive prompts require a TTY terminal" and exits with error, even with `--force`. This happens when the new schema would cause a conflict resolution prompt (e.g. adding tables that share names with existing DB tables).

**How to apply:** For new tables, use executeSql:
```javascript
await executeSql({ sqlQuery: `CREATE TABLE IF NOT EXISTS my_table (...)` });
```
For schema changes to existing tables, use `ALTER TABLE IF NOT EXISTS` or check if columns exist before adding.
