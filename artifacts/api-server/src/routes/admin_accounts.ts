import { Router } from "express";
import { db, pool, usersTable, settingsTable, commissionDeductionsTable } from "@workspace/db";
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
  agencyId: u.agencyId ?? null,
  billingMode: u.billingMode ?? null,
  commissionRate: u.commissionRate != null ? parseFloat(String(u.commissionRate)) : null,
  billingAmount: u.billingAmount != null ? parseFloat(String(u.billingAmount)) : null,
  subscriptionStatus: u.subscriptionStatus ?? null,
  createdAt: u.createdAt instanceof Date ? u.createdAt.toISOString() : String(u.createdAt),
});

router.get("/admin/accounts", requireAuth, requireRole("admin"), async (req, res): Promise<void> => {
  const role = req.query.role as string | undefined;
  const status = req.query.status as string | undefined;
  const search = req.query.search as string | undefined;
  const pageNum = parseInt((req.query.page as string) ?? "1", 10);
  const limitNum = parseInt((req.query.limit as string) ?? "20", 10);
  const offset = (pageNum - 1) * limitNum;

  const conditions: ReturnType<typeof eq>[] = [];
  if (role === "brand" || role === "creator" || role === "agency") conditions.push(eq(usersTable.role, role));
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
  const id = parseInt(req.params.id as string, 10);
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
  const id = parseInt(req.params.id as string, 10);
  await db.delete(usersTable).where(eq(usersTable.id, id));
  res.json({ message: "Deleted" });
});

router.get("/admin/accounts/:id/billing", requireAuth, requireRole("admin"), async (req, res): Promise<void> => {
  const id = parseInt(req.params.id as string, 10);
  const [user] = await db.select({
    id: usersTable.id, billingMode: usersTable.billingMode, billingAmount: usersTable.billingAmount,
    commissionRate: usersTable.commissionRate, subscriptionStatus: usersTable.subscriptionStatus,
  }).from(usersTable).where(eq(usersTable.id, id));
  if (!user) { res.status(404).json({ error: "Not found" }); return; }
  res.json(user);
});

router.put("/admin/accounts/:id/billing", requireAuth, requireRole("admin"), async (req, res): Promise<void> => {
  const id = parseInt(req.params.id as string, 10);
  const { billingMode, billingAmount, commissionRate, subscriptionStatus } = req.body;
  const updates: Record<string, unknown> = { updatedAt: new Date() };
  if (billingMode !== undefined) updates.billingMode = billingMode;
  if (billingAmount !== undefined) updates.billingAmount = String(billingAmount);
  if (commissionRate !== undefined) updates.commissionRate = String(commissionRate);
  if (subscriptionStatus !== undefined) updates.subscriptionStatus = subscriptionStatus;
  await db.update(usersTable).set(updates).where(eq(usersTable.id, id));
  res.json({ message: "Billing updated" });
});

router.get("/admin/payments/subscriptions", requireAuth, requireRole("admin"), async (_req, res): Promise<void> => {
  const users = await db.select({
    id: usersTable.id, firstName: usersTable.firstName, lastName: usersTable.lastName,
    email: usersTable.email, role: usersTable.role, companyName: usersTable.companyName,
    billingMode: usersTable.billingMode, billingAmount: usersTable.billingAmount,
    subscriptionStatus: usersTable.subscriptionStatus, createdAt: usersTable.createdAt,
  }).from(usersTable)
    .where(eq(usersTable.billingMode, "subscription"))
    .orderBy(usersTable.createdAt);
  res.json(users.map(u => ({
    ...u,
    billingAmount: parseFloat(String(u.billingAmount ?? "0")),
    createdAt: u.createdAt instanceof Date ? u.createdAt.toISOString() : String(u.createdAt),
  })));
});

router.get("/admin/payments/commissions", requireAuth, requireRole("admin"), async (_req, res): Promise<void> => {
  const rows = await db.select({
    id: commissionDeductionsTable.id,
    campaignId: commissionDeductionsTable.campaignId,
    userId: commissionDeductionsTable.userId,
    agencyId: commissionDeductionsTable.agencyId,
    deductionPercent: commissionDeductionsTable.deductionPercent,
    deductionAmount: commissionDeductionsTable.deductionAmount,
    createdAt: commissionDeductionsTable.createdAt,
    firstName: usersTable.firstName,
    lastName: usersTable.lastName,
    email: usersTable.email,
  }).from(commissionDeductionsTable)
    .leftJoin(usersTable, eq(commissionDeductionsTable.userId, usersTable.id))
    .orderBy(commissionDeductionsTable.createdAt);
  res.json(rows.map(r => ({
    ...r,
    deductionPercent: parseFloat(String(r.deductionPercent ?? "0")),
    deductionAmount: parseFloat(String(r.deductionAmount ?? "0")),
    createdAt: r.createdAt instanceof Date ? r.createdAt.toISOString() : String(r.createdAt),
  })));
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
    siteName: s.siteName ?? null, siteDescription: s.siteDescription ?? null,
    contactEmail: s.contactEmail ?? null, registrationStatus: s.registrationStatus ?? null,
    loginStatus: s.loginStatus ?? null, facebookUrl: s.facebookUrl ?? null,
    instagramUrl: s.instagramUrl ?? null, youtubeUrl: s.youtubeUrl ?? null,
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

// ── Roles & Permissions — persisted in a dedicated DB column ─────────────────

const DEFAULT_PERMISSIONS = {
  brand:   { createCampaign: true,  inviteCreators: true,  viewAnalytics: true,   purchaseGems: true,       manageProfile: true },
  creator: { acceptInvites: true,   submitContent: true,   requestPayout: true,   viewEarnings: true,       manageProfile: true },
  admin:   { manageUsers: true,     manageCampaigns: true, manageSettings: true,  manageContent: true,      broadcastMessages: true },
};

router.get("/admin/roles", requireAuth, requireRole("admin"), async (_req, res): Promise<void> => {
  try {
    const rows = await db.select({ rolePermissions: settingsTable.rolePermissions }).from(settingsTable).limit(1);
    const stored = rows[0]?.rolePermissions;
    if (stored) {
      try { res.json(JSON.parse(stored)); return; } catch { /* fall through */ }
    }
    res.json(DEFAULT_PERMISSIONS);
  } catch {
    res.json(DEFAULT_PERMISSIONS);
  }
});

const saveRoles = async (req: import("express").Request, res: import("express").Response): Promise<void> => {
  try {
    const json = JSON.stringify(req.body);
    // Upsert: ensure a settings row exists (id=1), then update rolePermissions
    await pool.query(
      `INSERT INTO settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING`,
    );
    await db.update(settingsTable).set({ rolePermissions: json }).where(eq(settingsTable.id, 1));
    res.json({ message: "Permissions updated", permissions: req.body });
  } catch (err) {
    console.error("Failed to persist permissions:", err);
    res.status(500).json({ error: "Failed to persist permissions" });
  }
};

router.put("/admin/roles", requireAuth, requireRole("admin"), saveRoles);
router.post("/admin/roles", requireAuth, requireRole("admin"), saveRoles);

export default router;
