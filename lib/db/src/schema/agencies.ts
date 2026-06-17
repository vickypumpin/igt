import { pgTable, serial, integer, text, numeric, timestamp, type AnyPgColumn } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";

export const agenciesTable = pgTable("agencies", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references((): AnyPgColumn => usersTable.id),
  name: text("name").notNull(),
  logoUrl: text("logo_url"),
  contactName: text("contact_name"),
  contactEmail: text("contact_email"),
  contactPhone: text("contact_phone"),
  billingMode: text("billing_mode").notNull().default("commission"),
  billingAmount: numeric("billing_amount", { precision: 12, scale: 2 }).default("0"),
  commissionRate: numeric("commission_rate", { precision: 5, scale: 2 }).default("5.00"),
  subscriptionStatus: text("subscription_status").default("active"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertAgencySchema = createInsertSchema(agenciesTable).omit({ id: true, createdAt: true });
export type InsertAgency = z.infer<typeof insertAgencySchema>;
export type Agency = typeof agenciesTable.$inferSelect;
