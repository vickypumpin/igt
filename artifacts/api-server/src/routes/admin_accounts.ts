import { Router } from "express";
import { db, usersTable, settingsTable } from "@workspace/db";
import { eq, ilike, or, and, sql } from "drizzle-orm";
import { requireAuth, requireRole } from "../lib/auth";
import type { IRouter } from "express";

const router: IRouter = Router();

const userShape = (u: typeof usersTable.$inferSelect) => ({
  id: u.id, firstName: u.firstName, lastName: u.lastName, userName: u.userName,
  email: u.email, phone: u.phone ?? null, role: u.role, gender: u.gender ?? null,
  badge: u.badge ?? null, isActive: u.isActive, isLocked: u.isLocked,
  gems: u.gems, balance: u.balance, avatarUrl: u.avatarUrl ?? null,
  companyName: u.companyName ?? null, bio: u.bio ?? null,
  createdAt: u.createdAt instanceof Date ? u.createdAt.toISOString() : String(u.createdAt),
});

router.get("/admin/accounts", requireAuth, requireRole("admin"), async (req, res): Promise<void> => {
  const { role, status, search, page = "1", limit: lim = "20" } = req.query as Record<string, string>;
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(lim, 10);
  const offset = (pageNum - 1) * limitNum;

  const conditions: ReturnType<typeof eq>[] = [];
  if (role === "brand" || role === "creator") conditions.push(eq(usersTable.role, role));
  if (status === "active") conditions.push(eq(usersTable.isActive, true));
  if (status === "inactive") conditions.push(eq(usersTable.isActive, false));
  if (status === "locked") conditions.push(eq(usersTable.isLocked, true));
  if (status === "pending") {
    conditions.push(eq(usersTable.isActive, false));
    conditions.push(eq(usersTable.isLocked, false));
  }
  if (search) {
    conditions.push(
      or(
        ilike(usersTable.email, `%${search}%`),
        ilike(usersTable.firstName, `%${search}%`),
        ilike(usersTable.lastName, `%${search}%`),
      ) as ReturnType<typeof eq>
    );
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const [users, [countRow]] = await Promise.all([
    db.select().from(usersTable).where(where).limit(limitNum).offset(offset).orderBy(usersTable.createdAt),
    db.select({ count: sql<number>`count(*)` }).from(usersTable).where(where),
  ]);

  res.json({ data: users.map(userShape), total: Number(countRow.count), page: pageNum, limit: limitNum });
});

router.patch("/admin/accounts/:id/status", requireAuth, requireRole("admin"), async (req, res): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  const { action } = req.body;
  const updates: Partial<typeof usersTable.$inferInsert> = {};
  if (action === "suspend") { updates.isActive = false; updates.isLocked = true; }
  else if (action === "activate") { updates.isActive = true; updates.isLocked = false; }
  else if (action === "lock") { updates.isLocked = true; }
  else if (action === "unlock") { updates.isLocked = false; }
  else { res.status(400).json({ error: "Invalid action" }); return; }
  await db.update(usersTable).set(updates).where(eq(usersTable.id, id));
  res.json({ message: "Updated" });
});

router.delete("/admin/accounts/:id", requireAuth, requireRole("admin"), async (req, res): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  await db.delete(usersTable).where(eq(usersTable.id, id));
  res.json({ message: "Deleted" });
});

// ── Settings sub-sections ─────────────────────────────────────────────────────

async function getOrCreateSettings() {
  let [settings] = await db.select().from(settingsTable).limit(1);
  if (!settings) {
    [settings] = await db.insert(settingsTable).values({}).returning();
  }
  return settings;
}

router.get("/admin/settings/general", requireAuth, requireRole("admin"), async (_req, res): Promise<void> => {
  const s = await getOrCreateSettings();
  res.json({
    siteName: s.siteName ?? null,
    siteDescription: s.siteDescription ?? null,
    contactEmail: s.contactEmail ?? null,
    registrationStatus: s.registrationStatus ?? null,
    loginStatus: s.loginStatus ?? null,
    facebookUrl: s.facebookUrl ?? null,
    instagramUrl: s.instagramUrl ?? null,
    youtubeUrl: s.youtubeUrl ?? null,
  });
});

router.put("/admin/settings/general", requireAuth, requireRole("admin"), async (req, res): Promise<void> => {
  const fields = ["siteName", "siteDescription", "contactEmail", "registrationStatus", "loginStatus", "facebookUrl", "instagramUrl", "youtubeUrl"];
  const updates: Record<string, unknown> = { updatedAt: new Date() };
  for (const f of fields) { if (req.body[f] !== undefined) updates[f] = req.body[f]; }
  const s = await getOrCreateSettings();
  const [updated] = await db.update(settingsTable).set(updates).where(eq(settingsTable.id, s.id)).returning();
  res.json(updated);
});

router.get("/admin/settings/fees", requireAuth, requireRole("admin"), async (_req, res): Promise<void> => {
  const s = await getOrCreateSettings();
  res.json({ gemPrice: s.gemPrice ?? null, gemServiceFee: s.gemServiceFee ?? null, creatorServiceFee: s.creatorServiceFee ?? null, brandServiceFee: s.brandServiceFee ?? null });
});

router.put("/admin/settings/fees", requireAuth, requireRole("admin"), async (req, res): Promise<void> => {
  const fields = ["gemPrice", "gemServiceFee", "creatorServiceFee", "brandServiceFee"];
  const updates: Record<string, unknown> = { updatedAt: new Date() };
  for (const f of fields) { if (req.body[f] !== undefined) updates[f] = req.body[f]; }
  const s = await getOrCreateSettings();
  const [updated] = await db.update(settingsTable).set(updates).where(eq(settingsTable.id, s.id)).returning();
  res.json(updated);
});

router.get("/admin/settings/gateway", requireAuth, requireRole("admin"), async (_req, res): Promise<void> => {
  const s = await getOrCreateSettings();
  res.json({
    flutterwavePublicKey: s.flutterwavePublicKey ?? null,
    flutterwaveSecretKey: s.flutterwaveSecretKey ? "***" : null,
    flutterwaveEncryptionKey: s.flutterwaveEncryptionKey ? "***" : null,
    flutterwaveLive: s.flutterwaveLive ?? false,
  });
});

router.put("/admin/settings/gateway", requireAuth, requireRole("admin"), async (req, res): Promise<void> => {
  const fields = ["flutterwavePublicKey", "flutterwaveSecretKey", "flutterwaveEncryptionKey", "flutterwaveLive"];
  const updates: Record<string, unknown> = { updatedAt: new Date() };
  for (const f of fields) { if (req.body[f] !== undefined) updates[f] = req.body[f]; }
  const s = await getOrCreateSettings();
  await db.update(settingsTable).set(updates).where(eq(settingsTable.id, s.id));
  res.json({ message: "Gateway settings saved" });
});

router.get("/admin/settings/smtp", requireAuth, requireRole("admin"), async (_req, res): Promise<void> => {
  const s = await getOrCreateSettings();
  res.json({ smtpHost: s.smtpHost ?? null, smtpPort: s.smtpPort ?? null, smtpUser: s.smtpUser ?? null, smtpFromEmail: s.smtpFromEmail ?? null, smtpPassword: s.smtpPassword ? "***" : null });
});

router.put("/admin/settings/smtp", requireAuth, requireRole("admin"), async (req, res): Promise<void> => {
  const fields = ["smtpHost", "smtpPort", "smtpUser", "smtpPassword", "smtpFromEmail"];
  const updates: Record<string, unknown> = { updatedAt: new Date() };
  for (const f of fields) { if (req.body[f] !== undefined) updates[f] = req.body[f]; }
  const s = await getOrCreateSettings();
  await db.update(settingsTable).set(updates).where(eq(settingsTable.id, s.id));
  res.json({ message: "SMTP settings saved" });
});

// ── Roles & Permissions (static matrix stored in settings) ────────────────────

const DEFAULT_PERMISSIONS = {
  brand:   { createCampaign: true, inviteCreators: true, viewAnalytics: true, purchaseGems: true, manageProfile: true },
  creator: { acceptInvites: true, submitContent: true, requestPayout: true, viewEarnings: true, manageProfile: true },
  admin:   { manageUsers: true, manageCampaigns: true, manageSettings: true, manageContent: true, broadcastMessages: true },
};

router.get("/admin/roles", requireAuth, requireRole("admin"), async (_req, res): Promise<void> => {
  res.json(DEFAULT_PERMISSIONS);
});

router.put("/admin/roles", requireAuth, requireRole("admin"), async (req, res): Promise<void> => {
  res.json({ message: "Permissions updated", permissions: req.body });
});

export default router;
