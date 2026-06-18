import { pgTable, serial, integer, text, numeric, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";

export const gemsTransactionsTable = pgTable("gems_transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id),
  type: text("type").notNull().default("purchase"),
  gemsDelta: integer("gems_delta").notNull(),
  amount: numeric("amount", { precision: 12, scale: 2 }),
  description: text("description"),
  reference: text("reference"),
  gateway: text("gateway"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertGemsTransactionSchema = createInsertSchema(gemsTransactionsTable).omit({ id: true, createdAt: true });
export type InsertGemsTransaction = z.infer<typeof insertGemsTransactionSchema>;
export type GemsTransaction = typeof gemsTransactionsTable.$inferSelect;
