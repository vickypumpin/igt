import { pgTable, serial, integer, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";
import { agenciesTable } from "./agencies";

export const agencyClientsTable = pgTable("agency_clients", {
  id: serial("id").primaryKey(),
  agencyId: integer("agency_id").notNull().references(() => agenciesTable.id),
  brandUserId: integer("brand_user_id").notNull().references(() => usersTable.id),
  inviteStatus: text("invite_status").notNull().default("pending"),
  invitedAt: timestamp("invited_at").notNull().defaultNow(),
  joinedAt: timestamp("joined_at"),
});

export const insertAgencyClientSchema = createInsertSchema(agencyClientsTable).omit({ id: true, invitedAt: true });
export type InsertAgencyClient = z.infer<typeof insertAgencyClientSchema>;
export type AgencyClient = typeof agencyClientsTable.$inferSelect;
