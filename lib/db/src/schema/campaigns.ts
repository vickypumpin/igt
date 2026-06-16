import { pgTable, serial, text, integer, boolean, numeric, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";

export const campaignStatusEnum = pgEnum("campaign_status", ["pending", "active", "completed", "declined"]);
export const campaignTypeEnum = pgEnum("campaign_type", ["influencer", "content_creator"]);
export const campaignDurationEnum = pgEnum("campaign_duration", ["day", "weekly"]);

export const campaignsTable = pgTable("campaigns", {
  id: serial("id").primaryKey(),
  brandId: integer("brand_id").notNull().references(() => usersTable.id),
  name: text("name").notNull(),
  sponsor: text("sponsor").notNull(),
  description: text("description"),
  kpis: text("kpis"),
  type: campaignTypeEnum("type").notNull().default("influencer"),
  mood: text("mood"),
  ageRange: text("age_range"),
  campaignDuration: campaignDurationEnum("campaign_duration").notNull().default("day"),
  campaignCategoryId: integer("campaign_category_id"),
  creatorCategoryId: integer("creator_category_id"),
  status: campaignStatusEnum("status").notNull().default("pending"),
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull(),
  noOfCreators: integer("no_of_creators").notNull().default(1),
  gemsPerCreator: integer("gems_per_creator").notNull().default(0),
  noOfDay: integer("no_of_day"),
  noOfWeek: integer("no_of_week"),
  brandDescription: text("brand_description"),
  postCaptionText: text("post_caption_text"),
  handlesHash: text("handles_hash"),
  dos: text("dos"),
  donts: text("donts"),
  coverImageUrl: text("cover_image_url"),
  // Daily deliverables
  dailyInstagramPost: integer("daily_instagram_post").notNull().default(0),
  dailyInstagramStoryPost: integer("daily_instagram_story_post").notNull().default(0),
  dailyInstagramReel: integer("daily_instagram_reel").notNull().default(0),
  dailyInstagramLive: integer("daily_instagram_live").notNull().default(0),
  dailyFbPost: integer("daily_fb_post").notNull().default(0),
  dailyFbStoryPost: integer("daily_fb_story_post").notNull().default(0),
  dailyTiktokPost: integer("daily_tiktok_post").notNull().default(0),
  dailyYoutubePost: integer("daily_youtube_post").notNull().default(0),
  dailyYoutubeVideo: integer("daily_youtube_video").notNull().default(0),
  dailyYoutubeShort: integer("daily_youtube_short").notNull().default(0),
  dailyTwitterPost: integer("daily_twitter_post").notNull().default(0),
  dailySnapchatStory: integer("daily_snapchat_story").notNull().default(0),
  // Weekly deliverables
  weeklyInstagramPost: integer("weekly_instagram_post").notNull().default(0),
  weeklyInstagramStoryPost: integer("weekly_instagram_story_post").notNull().default(0),
  weeklyInstagramReel: integer("weekly_instagram_reel").notNull().default(0),
  weeklyFbPost: integer("weekly_fb_post").notNull().default(0),
  weeklyTiktokPost: integer("weekly_tiktok_post").notNull().default(0),
  weeklyYoutubePost: integer("weekly_youtube_post").notNull().default(0),
  weeklyTwitterPost: integer("weekly_twitter_post").notNull().default(0),
  weeklySnapchatStory: integer("weekly_snapchat_story").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertCampaignSchema = createInsertSchema(campaignsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertCampaign = z.infer<typeof insertCampaignSchema>;
export type Campaign = typeof campaignsTable.$inferSelect;
