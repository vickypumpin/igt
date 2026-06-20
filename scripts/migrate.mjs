/**
 * Standalone database migration script using drizzle-orm's migrate() API.
 * Run this before starting the API server, or as a standalone admin command.
 *
 * Usage:
 *   node scripts/migrate.mjs
 *
 * Reads DATABASE_URL from the environment. Exits with code 1 on failure.
 * The migrations folder is expected at lib/db/migrations relative to CWD.
 */

import path from "node:path";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import pg from "pg";

const { Pool } = pg;

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("[migrate] ERROR: DATABASE_URL environment variable is not set.");
  process.exit(1);
}

const MIGRATIONS_FOLDER = path.join(process.cwd(), "lib/db/migrations");

console.log(`[migrate] Applying migrations from: ${MIGRATIONS_FOLDER}`);

const pool = new Pool({ connectionString: databaseUrl });
const db = drizzle(pool);

try {
  await migrate(db, { migrationsFolder: MIGRATIONS_FOLDER });
  console.log("[migrate] Migrations applied successfully.");
} catch (err) {
  console.error("[migrate] Migration failed:", err);
  process.exit(1);
} finally {
  await pool.end();
}
