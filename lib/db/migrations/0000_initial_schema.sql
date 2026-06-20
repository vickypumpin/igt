-- iGoTrend initial schema
-- Generated from lib/db/src/schema/*

--> statement-breakpoint
DO $$ BEGIN
  CREATE TYPE "public"."user_role" AS ENUM('brand', 'creator', 'admin', 'agency');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

--> statement-breakpoint
DO $$ BEGIN
  CREATE TYPE "public"."badge_tier" AS ENUM('nano', 'micro', 'mid_tier', 'macro', 'mega', 'elite');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

--> statement-breakpoint
DO $$ BEGIN
  CREATE TYPE "public"."gender" AS ENUM('male', 'female');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

--> statement-breakpoint
DO $$ BEGIN
  CREATE TYPE "public"."campaign_status" AS ENUM('pending', 'active', 'completed', 'declined');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

--> statement-breakpoint
DO $$ BEGIN
  CREATE TYPE "public"."campaign_type" AS ENUM('influencer', 'content_creator');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

--> statement-breakpoint
DO $$ BEGIN
  CREATE TYPE "public"."campaign_duration" AS ENUM('day', 'weekly');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

--> statement-breakpoint
DO $$ BEGIN
  CREATE TYPE "public"."invite_status" AS ENUM('pending', 'active', 'completed', 'declined');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

--> statement-breakpoint
DO $$ BEGIN
  CREATE TYPE "public"."submission_status" AS ENUM('pending', 'approved', 'rejected');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

--> statement-breakpoint
DO $$ BEGIN
  CREATE TYPE "public"."reward_type" AS ENUM('gems', 'airtime');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

--> statement-breakpoint
DO $$ BEGIN
  CREATE TYPE "public"."kyc_status" AS ENUM('pending', 'approved', 'rejected');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

--> statement-breakpoint
DO $$ BEGIN
  CREATE TYPE "public"."kyc_id_type" AS ENUM('national_id', 'passport', 'drivers_licence');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

--> statement-breakpoint
-- Create users without agency_id FK first (circular ref resolved below)
CREATE TABLE IF NOT EXISTS "users" (
  "id" serial PRIMARY KEY NOT NULL,
  "first_name" text NOT NULL,
  "last_name" text NOT NULL,
  "user_name" text NOT NULL,
  "email" text NOT NULL,
  "password_hash" text NOT NULL,
  "phone" text,
  "role" "user_role" NOT NULL DEFAULT 'brand',
  "gender" "gender",
  "badge" "badge_tier",
  "is_active" boolean NOT NULL DEFAULT true,
  "is_locked" boolean NOT NULL DEFAULT false,
  "country_id" integer,
  "state_id" integer,
  "company_name" text,
  "company_size" text,
  "company_type" text,
  "instagram_profile" text,
  "facebook_profile" text,
  "twitter_profile" text,
  "youtube_profile" text,
  "tiktok_profile" text,
  "snapchat_profile" text,
  "content_category" text,
  "creator_category" text,
  "bio" text,
  "avatar_url" text,
  "dob" text,
  "gems" integer NOT NULL DEFAULT 0,
  "balance" numeric(12, 2) NOT NULL DEFAULT 0,
  "instagram_day_post_price" integer,
  "instagram_week_post_price" integer,
  "instagram_day_story_price" integer,
  "instagram_week_story_price" integer,
  "instagram_day_reel_price" integer,
  "instagram_week_reel_price" integer,
  "instagram_day_live_price" integer,
  "instagram_week_live_price" integer,
  "fb_day_post_price" integer,
  "fb_week_post_price" integer,
  "fb_day_story_price" integer,
  "fb_week_story_price" integer,
  "fb_day_reel_price" integer,
  "fb_week_reel_price" integer,
  "tiktok_day_post_price" integer,
  "tiktok_week_post_price" integer,
  "youtube_day_post_price" integer,
  "youtube_week_post_price" integer,
  "twitter_day_post_price" integer,
  "twitter_week_post_price" integer,
  "snapchat_day_story_price" integer,
  "snapchat_week_story_price" integer,
  "content_creator_rate" integer,
  "instagram_followers" integer,
  "facebook_followers" integer,
  "twitter_followers" integer,
  "youtube_followers" integer,
  "tiktok_followers" integer,
  "snapchat_followers" integer,
  "agency_id" integer,
  "billing_mode" text DEFAULT 'commission',
  "billing_amount" numeric(12, 2) DEFAULT 0,
  "commission_rate" numeric(5, 2) DEFAULT 5.00,
  "subscription_status" text DEFAULT 'active',
  "billing_notes" text,
  "reserved_balance" integer NOT NULL DEFAULT 0,
  "verified" boolean NOT NULL DEFAULT false,
  "onboarding_complete" boolean NOT NULL DEFAULT false,
  "profile_public" boolean NOT NULL DEFAULT true,
  "website_url" text,
  "failed_login_attempts" integer NOT NULL DEFAULT 0,
  "locked_until" timestamp,
  "followers_flag" boolean NOT NULL DEFAULT false,
  "created_at" timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp NOT NULL DEFAULT now()
);

--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "users" ADD CONSTRAINT "users_user_name_unique" UNIQUE("user_name");
EXCEPTION WHEN duplicate_object THEN null;
END $$;

--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "users" ADD CONSTRAINT "users_email_unique" UNIQUE("email");
EXCEPTION WHEN duplicate_object THEN null;
END $$;

--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "agencies" (
  "id" serial PRIMARY KEY NOT NULL,
  "user_id" integer NOT NULL,
  "name" text NOT NULL,
  "logo_url" text,
  "contact_name" text,
  "contact_email" text,
  "contact_phone" text,
  "billing_mode" text NOT NULL DEFAULT 'commission',
  "billing_amount" numeric(12, 2) DEFAULT 0,
  "commission_rate" numeric(5, 2) DEFAULT 5.00,
  "subscription_status" text DEFAULT 'active',
  "created_at" timestamp NOT NULL DEFAULT now()
);

--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "agencies" ADD CONSTRAINT "agencies_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

--> statement-breakpoint
-- Resolve circular ref: users.agency_id → agencies.id
DO $$ BEGIN
  ALTER TABLE "users" ADD CONSTRAINT "users_agency_id_agencies_id_fk" FOREIGN KEY ("agency_id") REFERENCES "public"."agencies"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "agency_clients" (
  "id" serial PRIMARY KEY NOT NULL,
  "agency_id" integer NOT NULL,
  "brand_user_id" integer NOT NULL,
  "invite_status" text NOT NULL DEFAULT 'pending',
  "invited_at" timestamp NOT NULL DEFAULT now(),
  "joined_at" timestamp
);

--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "agency_clients" ADD CONSTRAINT "agency_clients_agency_id_agencies_id_fk" FOREIGN KEY ("agency_id") REFERENCES "public"."agencies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "agency_clients" ADD CONSTRAINT "agency_clients_brand_user_id_users_id_fk" FOREIGN KEY ("brand_user_id") REFERENCES "public"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "campaigns" (
  "id" serial PRIMARY KEY NOT NULL,
  "brand_id" integer NOT NULL,
  "name" text NOT NULL,
  "sponsor" text NOT NULL,
  "description" text,
  "kpis" text,
  "type" "campaign_type" NOT NULL DEFAULT 'influencer',
  "mood" text,
  "age_range" text,
  "campaign_duration" "campaign_duration" NOT NULL DEFAULT 'day',
  "campaign_category_id" integer,
  "creator_category_id" integer,
  "status" "campaign_status" NOT NULL DEFAULT 'pending',
  "start_date" text NOT NULL,
  "end_date" text NOT NULL,
  "no_of_creators" integer NOT NULL DEFAULT 1,
  "gems_per_creator" integer NOT NULL DEFAULT 0,
  "no_of_day" integer,
  "no_of_week" integer,
  "brand_description" text,
  "post_caption_text" text,
  "handles_hash" text,
  "dos" text,
  "donts" text,
  "cover_image_url" text,
  "is_funded" boolean NOT NULL DEFAULT false,
  "daily_instagram_post" integer NOT NULL DEFAULT 0,
  "daily_instagram_story_post" integer NOT NULL DEFAULT 0,
  "daily_instagram_reel" integer NOT NULL DEFAULT 0,
  "daily_instagram_live" integer NOT NULL DEFAULT 0,
  "daily_fb_post" integer NOT NULL DEFAULT 0,
  "daily_fb_story_post" integer NOT NULL DEFAULT 0,
  "daily_tiktok_post" integer NOT NULL DEFAULT 0,
  "daily_youtube_post" integer NOT NULL DEFAULT 0,
  "daily_youtube_video" integer NOT NULL DEFAULT 0,
  "daily_youtube_short" integer NOT NULL DEFAULT 0,
  "daily_twitter_post" integer NOT NULL DEFAULT 0,
  "daily_snapchat_story" integer NOT NULL DEFAULT 0,
  "weekly_instagram_post" integer NOT NULL DEFAULT 0,
  "weekly_instagram_story_post" integer NOT NULL DEFAULT 0,
  "weekly_instagram_reel" integer NOT NULL DEFAULT 0,
  "weekly_fb_post" integer NOT NULL DEFAULT 0,
  "weekly_tiktok_post" integer NOT NULL DEFAULT 0,
  "weekly_youtube_post" integer NOT NULL DEFAULT 0,
  "weekly_twitter_post" integer NOT NULL DEFAULT 0,
  "weekly_snapchat_story" integer NOT NULL DEFAULT 0,
  "created_at" timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp NOT NULL DEFAULT now()
);

--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_brand_id_users_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "campaign_invites" (
  "id" serial PRIMARY KEY NOT NULL,
  "campaign_id" integer NOT NULL,
  "creator_id" integer NOT NULL,
  "status" "invite_status" NOT NULL DEFAULT 'pending',
  "source" text NOT NULL DEFAULT 'brand',
  "created_at" timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp NOT NULL DEFAULT now()
);

--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "campaign_invites" ADD CONSTRAINT "campaign_invites_campaign_id_campaigns_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "public"."campaigns"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "campaign_invites" ADD CONSTRAINT "campaign_invites_creator_id_users_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "submissions" (
  "id" serial PRIMARY KEY NOT NULL,
  "campaign_id" integer NOT NULL,
  "creator_id" integer NOT NULL,
  "screenshot_url" text NOT NULL DEFAULT '',
  "file_data" text,
  "file_name" text,
  "file_type" text,
  "platform" text,
  "status" "submission_status" NOT NULL DEFAULT 'pending',
  "views" integer,
  "likes" integer,
  "rating" integer,
  "caption" text,
  "note" text,
  "created_at" timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp NOT NULL DEFAULT now()
);

--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "submissions" ADD CONSTRAINT "submissions_campaign_id_campaigns_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "public"."campaigns"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "submissions" ADD CONSTRAINT "submissions_creator_id_users_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "payments" (
  "id" serial PRIMARY KEY NOT NULL,
  "user_id" integer NOT NULL,
  "campaign_id" integer,
  "amount" numeric(12, 2) NOT NULL,
  "tax_amount" numeric(12, 2) NOT NULL DEFAULT 0,
  "payment_type" text NOT NULL DEFAULT 'campaign',
  "payment_status" boolean NOT NULL DEFAULT false,
  "tx_ref" text NOT NULL,
  "gateway" text,
  "created_at" timestamp NOT NULL DEFAULT now()
);

--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "payments" ADD CONSTRAINT "payments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rewards" (
  "id" serial PRIMARY KEY NOT NULL,
  "from_user_id" integer,
  "to_user_id" integer NOT NULL,
  "campaign_id" integer,
  "type" "reward_type" NOT NULL DEFAULT 'gems',
  "amount" numeric(12, 2) NOT NULL,
  "status" boolean NOT NULL DEFAULT false,
  "created_at" timestamp NOT NULL DEFAULT now()
);

--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "rewards" ADD CONSTRAINT "rewards_from_user_id_users_id_fk" FOREIGN KEY ("from_user_id") REFERENCES "public"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "rewards" ADD CONSTRAINT "rewards_to_user_id_users_id_fk" FOREIGN KEY ("to_user_id") REFERENCES "public"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "payouts" (
  "id" serial PRIMARY KEY NOT NULL,
  "creator_id" integer NOT NULL,
  "campaign_id" integer,
  "amount" numeric(12, 2) NOT NULL,
  "status" text NOT NULL DEFAULT 'pending',
  "bank_code" text,
  "account_number" text,
  "gateway" text,
  "transfer_ref" text,
  "created_at" timestamp NOT NULL DEFAULT now()
);

--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "payouts" ADD CONSTRAINT "payouts_creator_id_users_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "messages" (
  "id" serial PRIMARY KEY NOT NULL,
  "from_user_id" integer NOT NULL,
  "to_user_id" integer NOT NULL,
  "body" text NOT NULL,
  "is_read" boolean NOT NULL DEFAULT false,
  "created_at" timestamp NOT NULL DEFAULT now()
);

--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "messages" ADD CONSTRAINT "messages_from_user_id_users_id_fk" FOREIGN KEY ("from_user_id") REFERENCES "public"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "messages" ADD CONSTRAINT "messages_to_user_id_users_id_fk" FOREIGN KEY ("to_user_id") REFERENCES "public"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "notifications" (
  "id" serial PRIMARY KEY NOT NULL,
  "user_id" integer NOT NULL,
  "type" text NOT NULL DEFAULT 'info',
  "message" text NOT NULL,
  "is_read" boolean NOT NULL DEFAULT false,
  "link" text,
  "created_at" timestamp NOT NULL DEFAULT now()
);

--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "settings" (
  "id" serial PRIMARY KEY NOT NULL,
  "site_name" text DEFAULT 'iGoTrend',
  "site_description" text,
  "gem_price" integer DEFAULT 1,
  "gem_service_fee" integer DEFAULT 5,
  "creator_service_fee" integer DEFAULT 10,
  "brand_service_fee" integer DEFAULT 5,
  "registration_status" boolean NOT NULL DEFAULT true,
  "login_status" boolean NOT NULL DEFAULT true,
  "sms_notify" boolean NOT NULL DEFAULT false,
  "facebook_url" text,
  "instagram_url" text,
  "youtube_url" text,
  "contact_email" text,
  "flutterwave_public_key" text,
  "flutterwave_secret_key" text,
  "flutterwave_encryption_key" text,
  "flutterwave_live" boolean NOT NULL DEFAULT false,
  "role_permissions" text,
  "default_billing_mode" text DEFAULT 'commission',
  "default_commission_rate" text DEFAULT '5.00',
  "paystack_public_key" text,
  "paystack_secret_key" text,
  "paystack_live" boolean NOT NULL DEFAULT false,
  "preferred_payment_gateway" text DEFAULT 'flutterwave',
  "sms_live247_api_key" text,
  "sms_live247_sender_name" text,
  "sms_live247_account_type" text,
  "smtp_host" text,
  "smtp_port" integer,
  "smtp_user" text,
  "smtp_password" text,
  "smtp_from_email" text,
  "updated_at" timestamp NOT NULL DEFAULT now()
);

--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "categories" (
  "id" serial PRIMARY KEY NOT NULL,
  "name" text NOT NULL,
  "slug" text NOT NULL,
  "type" text NOT NULL DEFAULT 'content',
  "created_at" timestamp NOT NULL DEFAULT now()
);

--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "categories" ADD CONSTRAINT "categories_slug_unique" UNIQUE("slug");
EXCEPTION WHEN duplicate_object THEN null;
END $$;

--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "verify_requests" (
  "id" serial PRIMARY KEY NOT NULL,
  "user_id" integer NOT NULL,
  "account_number" text NOT NULL,
  "bank_id" integer NOT NULL,
  "bank_name" text,
  "is_approved" boolean NOT NULL DEFAULT false,
  "created_at" timestamp NOT NULL DEFAULT now()
);

--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "bank_accounts" (
  "id" serial PRIMARY KEY NOT NULL,
  "user_id" integer NOT NULL,
  "bank_name" text NOT NULL,
  "bank_code" text,
  "account_number" text NOT NULL,
  "account_name" text NOT NULL,
  "is_default" boolean NOT NULL DEFAULT false,
  "verified" boolean NOT NULL DEFAULT false,
  "created_at" timestamp NOT NULL DEFAULT now()
);

--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "bank_accounts" ADD CONSTRAINT "bank_accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "faqs" (
  "id" serial PRIMARY KEY NOT NULL,
  "question" text NOT NULL,
  "answer" text NOT NULL,
  "category" text NOT NULL DEFAULT 'general',
  "is_active" boolean NOT NULL DEFAULT true,
  "sort_order" integer NOT NULL DEFAULT 0,
  "created_at" timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp NOT NULL DEFAULT now()
);

--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "legal_pages" (
  "id" serial PRIMARY KEY NOT NULL,
  "slug" text NOT NULL,
  "title" text NOT NULL,
  "content" text NOT NULL DEFAULT '',
  "updated_at" timestamp NOT NULL DEFAULT now()
);

--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "legal_pages" ADD CONSTRAINT "legal_pages_slug_unique" UNIQUE("slug");
EXCEPTION WHEN duplicate_object THEN null;
END $$;

--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "gems_transactions" (
  "id" serial PRIMARY KEY NOT NULL,
  "user_id" integer NOT NULL,
  "type" text NOT NULL DEFAULT 'purchase',
  "gems_delta" integer NOT NULL,
  "amount" numeric(12, 2),
  "description" text,
  "reference" text,
  "gateway" text,
  "created_at" timestamp NOT NULL DEFAULT now()
);

--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "gems_transactions" ADD CONSTRAINT "gems_transactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ai_conversations" (
  "id" serial PRIMARY KEY NOT NULL,
  "user_id" integer NOT NULL,
  "title" text NOT NULL,
  "created_at" timestamp NOT NULL DEFAULT now()
);

--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "ai_conversations" ADD CONSTRAINT "ai_conversations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ai_messages" (
  "id" serial PRIMARY KEY NOT NULL,
  "conversation_id" integer NOT NULL,
  "role" text NOT NULL,
  "content" text NOT NULL,
  "created_at" timestamp NOT NULL DEFAULT now()
);

--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "ai_messages" ADD CONSTRAINT "ai_messages_conversation_id_ai_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."ai_conversations"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "kyc_requests" (
  "id" serial PRIMARY KEY NOT NULL,
  "user_id" integer NOT NULL,
  "legal_name" text NOT NULL,
  "country" text NOT NULL,
  "id_type" "kyc_id_type" NOT NULL,
  "id_number" text NOT NULL,
  "document_url" text,
  "status" "kyc_status" NOT NULL DEFAULT 'pending',
  "created_at" timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp NOT NULL DEFAULT now()
);

--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "kyc_requests" ADD CONSTRAINT "kyc_requests_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "password_reset_tokens" (
  "id" serial PRIMARY KEY NOT NULL,
  "user_id" integer NOT NULL,
  "token" text NOT NULL,
  "expires_at" timestamp NOT NULL,
  "used_at" timestamp,
  "created_at" timestamp NOT NULL DEFAULT now()
);

--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_token_unique" UNIQUE("token");
EXCEPTION WHEN duplicate_object THEN null;
END $$;

--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "admin_audit_logs" (
  "id" serial PRIMARY KEY NOT NULL,
  "admin_id" integer NOT NULL,
  "action" text NOT NULL,
  "target_user_id" integer,
  "metadata" jsonb,
  "created_at" timestamp NOT NULL DEFAULT now()
);

--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "admin_audit_logs" ADD CONSTRAINT "admin_audit_logs_admin_id_users_id_fk" FOREIGN KEY ("admin_id") REFERENCES "public"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "admin_audit_logs" ADD CONSTRAINT "admin_audit_logs_target_user_id_users_id_fk" FOREIGN KEY ("target_user_id") REFERENCES "public"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "commission_deductions" (
  "id" serial PRIMARY KEY NOT NULL,
  "payout_id" integer,
  "campaign_id" integer,
  "user_id" integer NOT NULL,
  "agency_id" integer,
  "deduction_percent" numeric(5, 2) NOT NULL,
  "deduction_amount" numeric(12, 2) NOT NULL,
  "created_at" timestamp NOT NULL DEFAULT now()
);

--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "commission_deductions" ADD CONSTRAINT "commission_deductions_payout_id_unique" UNIQUE("payout_id");
EXCEPTION WHEN duplicate_object THEN null;
END $$;

--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "commission_deductions" ADD CONSTRAINT "commission_deductions_payout_id_payouts_id_fk" FOREIGN KEY ("payout_id") REFERENCES "public"."payouts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "commission_deductions" ADD CONSTRAINT "commission_deductions_campaign_id_campaigns_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "public"."campaigns"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
EXCEPTION WHEN duplicate_object THEN null;
END $$;

--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "commission_deductions" ADD CONSTRAINT "commission_deductions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
