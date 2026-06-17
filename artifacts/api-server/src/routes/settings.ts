import { Router } from "express";
import { sql } from "drizzle-orm";
import { db, settingsTable, categoriesTable } from "@workspace/db";
import { requireAuth, requireRole } from "../lib/auth";
import type { IRouter } from "express";

const router: IRouter = Router();

router.get("/settings", requireAuth, requireRole("admin"), async (req, res): Promise<void> => {
  const [settings] = await db.select().from(settingsTable).limit(1);
  if (!settings) {
    const [newSettings] = await db.insert(settingsTable).values({}).returning();
    res.json(newSettings);
    return;
  }
  res.json(settings);
});

router.patch("/settings", requireAuth, requireRole("admin"), async (req, res): Promise<void> => {
  const fields = [
    "siteName","siteDescription","gemPrice","gemServiceFee","creatorServiceFee","brandServiceFee",
    "defaultBillingMode","defaultCommissionRate",
    "registrationStatus","loginStatus","smsNotify","facebookUrl","instagramUrl","youtubeUrl","contactEmail",
    "flutterwavePublicKey","flutterwaveSecretKey","flutterwaveEncryptionKey","flutterwaveLive",
    "twilioAccountSid","twilioAuthToken","twilioPhoneNumber",
    "smtpHost","smtpPort","smtpUser","smtpPassword","smtpFromEmail",
  ];
  const updates: Record<string, unknown> = {};
  for (const f of fields) {
    if (req.body[f] != null) updates[f] = req.body[f];
  }
  updates.updatedAt = new Date();
  const [existing] = await db.select({ id: settingsTable.id }).from(settingsTable).limit(1);
  let settings;
  if (existing) {
    [settings] = await db.update(settingsTable).set(updates).where(sql`id = ${existing.id}`).returning();
  } else {
    [settings] = await db.insert(settingsTable).values(updates).returning();
  }
  res.json(settings);
});

router.get("/content-categories", requireAuth, async (req, res): Promise<void> => {
  const cats = await db.select().from(categoriesTable).where(sql`type = 'content'`);
  res.json(cats.map(c => ({ id: c.id, name: c.name, slug: c.slug })));
});

router.get("/creator-categories", requireAuth, async (req, res): Promise<void> => {
  const cats = await db.select().from(categoriesTable).where(sql`type = 'creator'`);
  res.json(cats.map(c => ({ id: c.id, name: c.name, slug: c.slug })));
});

export default router;
