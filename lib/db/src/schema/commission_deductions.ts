import { pgTable, serial, integer, numeric, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";
import { campaignsTable } from "./campaigns";

export const commissionDeductionsTable = pgTable("commission_deductions", {
  id: serial("id").primaryKey(),
  payoutId: integer("payout_id"),
  campaignId: integer("campaign_id").references(() => campaignsTable.id),
  userId: integer("user_id").notNull().references(() => usersTable.id),
  agencyId: integer("agency_id"),
  deductionPercent: numeric("deduction_percent", { precision: 5, scale: 2 }).notNull(),
  deductionAmount: numeric("deduction_amount", { precision: 12, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertCommissionDeductionSchema = createInsertSchema(commissionDeductionsTable).omit({ id: true, createdAt: true });
export type InsertCommissionDeduction = z.infer<typeof insertCommissionDeductionSchema>;
export type CommissionDeduction = typeof commissionDeductionsTable.$inferSelect;
