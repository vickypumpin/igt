import { pgTable, serial, text, integer, boolean, numeric, timestamp, pgEnum, type AnyPgColumn } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { agenciesTable } from "./agencies";

export const userRoleEnum = pgEnum("user_role", ["brand", "creator", "admin", "agency"]);
export const badgeTierEnum = pgEnum("badge_tier", ["nano", "micro", "mid_tier", "macro", "mega", "elite"]);
export const genderEnum = pgEnum("gender", ["male", "female"]);

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  userName: text("user_name").notNull().unique(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  phone: text("phone"),
  role: userRoleEnum("role").notNull().default("brand"),
  gender: genderEnum("gender"),
  badge: badgeTierEnum("badge"),
  isActive: boolean("is_active").notNull().default(true),
  isLocked: boolean("is_locked").notNull().default(false),
  countryId: integer("country_id"),
  stateId: integer("state_id"),
  companyName: text("company_name"),
  companySize: text("company_size"),
  companyType: text("company_type"),
  instagramProfile: text("instagram_profile"),
  facebookProfile: text("facebook_profile"),
  twitterProfile: text("twitter_profile"),
  youtubeProfile: text("youtube_profile"),
  tiktokProfile: text("tiktok_profile"),
  snapchatProfile: text("snapchat_profile"),
  contentCategory: text("content_category"),
  creatorCategory: text("creator_category"),
  bio: text("bio"),
  avatarUrl: text("avatar_url"),
  dob: text("dob"),
  gems: integer("gems").notNull().default(0),
  balance: numeric("balance", { precision: 12, scale: 2 }).notNull().default("0"),
  // Pricing rates (USD cents stored as integers)
  instagramDayPostPrice: integer("instagram_day_post_price"),
  instagramWeekPostPrice: integer("instagram_week_post_price"),
  instagramDayStoryPrice: integer("instagram_day_story_price"),
  instagramWeekStoryPrice: integer("instagram_week_story_price"),
  instagramDayReelPrice: integer("instagram_day_reel_price"),
  instagramWeekReelPrice: integer("instagram_week_reel_price"),
  instagramDayLivePrice: integer("instagram_day_live_price"),
  instagramWeekLivePrice: integer("instagram_week_live_price"),
  fbDayPostPrice: integer("fb_day_post_price"),
  fbWeekPostPrice: integer("fb_week_post_price"),
  fbDayStoryPrice: integer("fb_day_story_price"),
  fbWeekStoryPrice: integer("fb_week_story_price"),
  fbDayReelPrice: integer("fb_day_reel_price"),
  fbWeekReelPrice: integer("fb_week_reel_price"),
  tiktokDayPostPrice: integer("tiktok_day_post_price"),
  tiktokWeekPostPrice: integer("tiktok_week_post_price"),
  youtubeDayPostPrice: integer("youtube_day_post_price"),
  youtubeWeekPostPrice: integer("youtube_week_post_price"),
  twitterDayPostPrice: integer("twitter_day_post_price"),
  twitterWeekPostPrice: integer("twitter_week_post_price"),
  snapchatDayStoryPrice: integer("snapchat_day_story_price"),
  snapchatWeekStoryPrice: integer("snapchat_week_story_price"),
  contentCreatorRate: integer("content_creator_rate"),
  // Follower counts per platform
  instagramFollowers: integer("instagram_followers"),
  facebookFollowers: integer("facebook_followers"),
  twitterFollowers: integer("twitter_followers"),
  youtubeFollowers: integer("youtube_followers"),
  tiktokFollowers: integer("tiktok_followers"),
  snapchatFollowers: integer("snapchat_followers"),
  // Agency relationship + billing mode
  agencyId: integer("agency_id").references((): AnyPgColumn => agenciesTable.id, { onDelete: "set null" }),
  billingMode: text("billing_mode").default("commission"),
  billingAmount: numeric("billing_amount", { precision: 12, scale: 2 }).default("0"),
  commissionRate: numeric("commission_rate", { precision: 5, scale: 2 }).default("5.00"),
  subscriptionStatus: text("subscription_status").default("active"),
  billingNotes: text("billing_notes"),
  // Brand website
  websiteUrl: text("website_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(usersTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof usersTable.$inferSelect;
