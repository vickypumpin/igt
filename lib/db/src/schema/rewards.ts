import { pgTable, serial, integer, text, boolean, numeric, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";

export const rewardTypeEnum = pgEnum("reward_type", ["gems", "airtime"]);

export const rewardsTable = pgTable("rewards", {
  id: serial("id").primaryKey(),
  fromUserId: integer("from_user_id").references(() => usersTable.id),
  toUserId: integer("to_user_id").notNull().references(() => usersTable.id),
  campaignId: integer("campaign_id"),
  type: rewardTypeEnum("type").notNull().default("gems"),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  status: boolean("status").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const payoutsTable = pgTable("payouts", {
  id: serial("id").primaryKey(),
  creatorId: integer("creator_id").notNull().references(() => usersTable.id),
  campaignId: integer("campaign_id"),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  status: text("status").notNull().default("pending"),
  bankCode: text("bank_code"),
  accountNumber: text("account_number"),
  gateway: text("gateway"),
  transferRef: text("transfer_ref"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertRewardSchema = createInsertSchema(rewardsTable).omit({ id: true, createdAt: true });
export type InsertReward = z.infer<typeof insertRewardSchema>;
export type Reward = typeof rewardsTable.$inferSelect;

export const insertPayoutSchema = createInsertSchema(payoutsTable).omit({ id: true, createdAt: true });
export type InsertPayout = z.infer<typeof insertPayoutSchema>;
export type Payout = typeof payoutsTable.$inferSelect;
