import { pgTable, serial, integer, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";
import { campaignsTable } from "./campaigns";

export const inviteStatusEnum = pgEnum("invite_status", ["pending", "active", "completed", "declined"]);

export const campaignInvitesTable = pgTable("campaign_invites", {
  id: serial("id").primaryKey(),
  campaignId: integer("campaign_id").notNull().references(() => campaignsTable.id),
  creatorId: integer("creator_id").notNull().references(() => usersTable.id),
  status: inviteStatusEnum("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertCampaignInviteSchema = createInsertSchema(campaignInvitesTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertCampaignInvite = z.infer<typeof insertCampaignInviteSchema>;
export type CampaignInvite = typeof campaignInvitesTable.$inferSelect;
