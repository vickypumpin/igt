import { pgTable, serial, integer, text, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";

export const kycStatusEnum = pgEnum("kyc_status", ["pending", "approved", "rejected"]);
export const kycIdTypeEnum = pgEnum("kyc_id_type", ["national_id", "passport", "drivers_licence"]);

export const kycRequestsTable = pgTable("kyc_requests", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id),
  legalName: text("legal_name").notNull(),
  country: text("country").notNull(),
  idType: kycIdTypeEnum("id_type").notNull(),
  idNumber: text("id_number").notNull(),
  documentUrl: text("document_url"),
  status: kycStatusEnum("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertKycRequestSchema = createInsertSchema(kycRequestsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertKycRequest = z.infer<typeof insertKycRequestSchema>;
export type KycRequest = typeof kycRequestsTable.$inferSelect;
