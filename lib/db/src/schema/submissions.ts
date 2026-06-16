import { pgTable, serial, integer, text, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";
import { campaignsTable } from "./campaigns";

export const submissionStatusEnum = pgEnum("submission_status", ["pending", "approved", "rejected"]);

export const submissionsTable = pgTable("submissions", {
  id: serial("id").primaryKey(),
  campaignId: integer("campaign_id").notNull().references(() => campaignsTable.id),
  creatorId: integer("creator_id").notNull().references(() => usersTable.id),
  screenshotUrl: text("screenshot_url").notNull(),
  platform: text("platform"),
  status: submissionStatusEnum("status").notNull().default("pending"),
  views: integer("views"),
  likes: integer("likes"),
  rating: integer("rating"),
  caption: text("caption"),
  note: text("note"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertSubmissionSchema = createInsertSchema(submissionsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertSubmission = z.infer<typeof insertSubmissionSchema>;
export type Submission = typeof submissionsTable.$inferSelect;
