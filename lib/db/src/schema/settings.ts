import { pgTable, serial, text, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const settingsTable = pgTable("settings", {
  id: serial("id").primaryKey(),
  siteName: text("site_name").default("iGoTrend"),
  siteDescription: text("site_description"),
  gemPrice: integer("gem_price").default(1),
  gemServiceFee: integer("gem_service_fee").default(5),
  creatorServiceFee: integer("creator_service_fee").default(10),
  brandServiceFee: integer("brand_service_fee").default(5),
  registrationStatus: boolean("registration_status").notNull().default(true),
  loginStatus: boolean("login_status").notNull().default(true),
  smsNotify: boolean("sms_notify").notNull().default(false),
  facebookUrl: text("facebook_url"),
  instagramUrl: text("instagram_url"),
  youtubeUrl: text("youtube_url"),
  contactEmail: text("contact_email"),
  flutterwavePublicKey: text("flutterwave_public_key"),
  flutterwaveSecretKey: text("flutterwave_secret_key"),
  flutterwaveEncryptionKey: text("flutterwave_encryption_key"),
  flutterwaveLive: boolean("flutterwave_live").notNull().default(false),
  rolePermissions: text("role_permissions"),
  defaultBillingMode: text("default_billing_mode").default("commission"),
  defaultCommissionRate: text("default_commission_rate").default("5.00"),
  paystackPublicKey: text("paystack_public_key"),
  paystackSecretKey: text("paystack_secret_key"),
  paystackLive: boolean("paystack_live").notNull().default(false),
  preferredPaymentGateway: text("preferred_payment_gateway").default("flutterwave"),
  smsLive247ApiKey: text("sms_live247_api_key"),
  smsLive247SenderName: text("sms_live247_sender_name"),
  smsLive247AccountType: text("sms_live247_account_type"),
  smtpHost: text("smtp_host"),
  smtpPort: integer("smtp_port"),
  smtpUser: text("smtp_user"),
  smtpPassword: text("smtp_password"),
  smtpFromEmail: text("smtp_from_email"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const categoriesTable = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  type: text("type").notNull().default("content"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const verifyRequestsTable = pgTable("verify_requests", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  accountNumber: text("account_number").notNull(),
  bankId: integer("bank_id").notNull(),
  bankName: text("bank_name"),
  isApproved: boolean("is_approved").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertSettingsSchema = createInsertSchema(settingsTable).omit({ id: true, updatedAt: true });
export type InsertSettings = z.infer<typeof insertSettingsSchema>;
export type Settings = typeof settingsTable.$inferSelect;

export const insertCategorySchema = createInsertSchema(categoriesTable).omit({ id: true, createdAt: true });
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categoriesTable.$inferSelect;
