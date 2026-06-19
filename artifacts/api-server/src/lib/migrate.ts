import { pool } from "@workspace/db";
import { logger } from "./logger";

export async function runStartupMigrations(): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    await client.query(`
      DO $$ BEGIN
        CREATE TYPE kyc_status AS ENUM ('pending', 'approved', 'rejected');
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$;
    `);

    await client.query(`
      DO $$ BEGIN
        CREATE TYPE kyc_id_type AS ENUM ('national_id', 'passport', 'drivers_licence');
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$;
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS gems_transactions (
        id serial PRIMARY KEY,
        user_id integer NOT NULL REFERENCES users(id),
        type text NOT NULL DEFAULT 'purchase',
        gems_delta integer NOT NULL,
        amount numeric(12, 2),
        description text,
        reference text,
        gateway text,
        created_at timestamp NOT NULL DEFAULT now()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS kyc_requests (
        id serial PRIMARY KEY,
        user_id integer NOT NULL REFERENCES users(id),
        legal_name text NOT NULL,
        country text NOT NULL,
        id_type kyc_id_type NOT NULL,
        id_number text NOT NULL,
        document_url text,
        status kyc_status NOT NULL DEFAULT 'pending',
        created_at timestamp NOT NULL DEFAULT now(),
        updated_at timestamp NOT NULL DEFAULT now()
      );
    `);

    await client.query("COMMIT");
    logger.info("Startup migrations applied successfully");
  } catch (err) {
    await client.query("ROLLBACK");
    logger.error({ err }, "Startup migration failed");
    throw err;
  } finally {
    client.release();
  }
}
