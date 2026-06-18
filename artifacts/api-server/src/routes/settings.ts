import { Router } from "express";
import { sql } from "drizzle-orm";
import { db, settingsTable, categoriesTable } from "@workspace/db";
import { requireAuth, requireRole } from "../lib/auth";
import { sendTestEmail, sendTestSms, tplTest } from "../lib/notify";
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
    "paystackPublicKey","paystackSecretKey","paystackLive","preferredPaymentGateway",
    "smsLive247ApiKey","smsLive247SenderName","smsLive247AccountType",
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

// Test-send endpoints — authoritative: return 400 when config is missing, 502 on delivery failure
router.post("/settings/test-email", requireAuth, requireRole("admin"), async (req, res): Promise<void> => {
  const [settings] = await db.select({
    contactEmail: settingsTable.contactEmail,
    siteName: settingsTable.siteName,
  }).from(settingsTable).limit(1);

  const to = settings?.contactEmail;
  if (!to) {
    res.status(400).json({ error: "No contact email configured in General settings. Set it first then retry." });
    return;
  }

  const siteName = settings?.siteName ?? "iGoTrend";
  try {
    await sendTestEmail(to, `Test email from ${siteName}`, tplTest(siteName));
    res.json({ message: `Test email sent to ${to}` });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to send test email";
    const isConfig = msg.includes("not configured");
    res.status(isConfig ? 422 : 502).json({ error: msg });
  }
});

router.post("/settings/test-sms", requireAuth, requireRole("admin"), async (req, res): Promise<void> => {
  const { phone } = req.body;
  if (!phone) {
    res.status(400).json({ error: "phone is required" });
    return;
  }

  const [settings] = await db.select({ siteName: settingsTable.siteName }).from(settingsTable).limit(1);
  const siteName = settings?.siteName ?? "iGoTrend";

  try {
    await sendTestSms(phone, `${siteName}: This is a test SMS. Your SMSLive247 configuration is working correctly.`);
    res.json({ message: `Test SMS sent to ${phone}` });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to send test SMS";
    const isConfig = msg.includes("not configured");
    res.status(isConfig ? 422 : 502).json({ error: msg });
  }
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
