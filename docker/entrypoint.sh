#!/bin/sh
set -e

echo "[entrypoint] Running database migrations..."
node /app/scripts/migrate.mjs

echo "[entrypoint] Migrations complete. Starting API server..."
exec node --enable-source-maps /app/artifacts/api-server/dist/index.mjs
