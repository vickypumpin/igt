-- iGoTrend demo user seed
-- Run with: docker compose exec -T postgres psql -U igotrend igotrend < seed-demo-users.sql

BEGIN;

INSERT INTO users (
  first_name, last_name, user_name, email, password_hash, role,
  is_active, is_locked, onboarding_complete, profile_public, verified, gems, balance
) VALUES
  ('Admin',   'User',    'admin',      'admin@igotrend.com',    '$2b$10$jPAL8uNpj1TcFza11CnNBO4rfPbX7DtZFUOhwSfZh/WUzXaCQpasG', 'admin',   true, false, true, true, true, 0, 0),
  ('Brand',   'Demo',    'branddemo',  'brand@igotrend.com',    '$2b$10$5tWIFKsmSURDJewogfHsb.jBLgbtRwgx7Ro./8AeD8a8bG0afV/r2', 'brand',   true, false, true, true, true, 0, 0),
  ('Creator', 'One',     'creator1',   'creator1@igotrend.com', '$2b$10$5tWIFKsmSURDJewogfHsb.jBLgbtRwgx7Ro./8AeD8a8bG0afV/r2', 'creator', true, false, true, true, true, 0, 0),
  ('Agency',  'Demo',    'agencydemo', 'agency@igotrend.com',   '$2b$10$5tWIFKsmSURDJewogfHsb.jBLgbtRwgx7Ro./8AeD8a8bG0afV/r2', 'agency',  true, false, true, true, true, 0, 0)
ON CONFLICT (email) DO UPDATE SET
  password_hash      = EXCLUDED.password_hash,
  role               = EXCLUDED.role,
  is_active          = EXCLUDED.is_active,
  onboarding_complete = EXCLUDED.onboarding_complete,
  verified           = EXCLUDED.verified;

-- Create agency record for agency@igotrend.com
INSERT INTO agencies (user_id, name, contact_name, contact_email, billing_mode, commission_rate)
SELECT id, 'Agency Demo', 'Agency Demo', 'agency@igotrend.com', 'commission', '5.00'
FROM users WHERE email = 'agency@igotrend.com'
ON CONFLICT (user_id) DO NOTHING;

COMMIT;

-- Verify
SELECT id, email, role, is_active, verified FROM users WHERE email IN (
  'admin@igotrend.com','brand@igotrend.com','creator1@igotrend.com','agency@igotrend.com'
) ORDER BY id;
