import path from "node:path";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { pool } from "@workspace/db";
import { logger } from "./logger";

const MIGRATIONS_FOLDER = path.join(process.cwd(), "lib/db/migrations");

export async function runStartupMigrations(): Promise<void> {
  logger.info({ migrationsFolder: MIGRATIONS_FOLDER }, "Running Drizzle migrations...");

  const db = drizzle(pool);

  await migrate(db, { migrationsFolder: MIGRATIONS_FOLDER });

  logger.info("Drizzle migrations applied successfully");
}
