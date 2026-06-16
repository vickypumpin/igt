import { Router } from "express";
import { eq, and, desc } from "drizzle-orm";
import { db, bankAccountsTable, gemsTransactionsTable, usersTable, settingsTable } from "@workspace/db";
import { requireAuth } from "../lib/auth";
import type { IRouter } from "express";

const router: IRouter = Router();

// ── Server-authoritative gems package catalog ───────────────────────────────
const GEMS_PACKAGES: Record<string, { gems: number; amountNGN: number }> = {
  starter:    { gems: 500,  amountNGN: 5000  },
  growth:     { gems: 1100, amountNGN: 10000 },
  pro:        { gems: 3000, amountNGN: 25000 },
  enterprise: { gems: 6500, amountNGN: 50000 },
};

const accountShape = (a: typeof bankAccountsTable.$inferSelect) => ({
  id: a.id, userId: a.userId, bankName: a.bankName, bankCode: a.bankCode ?? null,
  accountNumber: a.accountNumber, accountName: a.accountName, isDefault: a.isDefault,
  createdAt: a.createdAt instanceof Date ? a.createdAt.toISOString() : String(a.createdAt),
});

const userProfileShape = (u: typeof usersTable.$inferSelect) => ({
  id: u.id, firstName: u.firstName, lastName: u.lastName, userName: u.userName, email: u.email,
  phone: u.phone ?? null, role: u.role, gender: u.gender ?? null, badge: u.badge ?? null,
  isActive: u.isActive, isLocked: u.isLocked, bio: u.bio ?? null, avatarUrl: u.avatarUrl ?? null,
  dob: u.dob ?? null, companyName: u.companyName ?? null, companySize: u.companySize ?? null, companyType: u.companyType ?? null,
  instagramProfile: u.instagramProfile ?? null, facebookProfile: u.facebookProfile ?? null,
  twitterProfile: u.twitterProfile ?? null, youtubeProfile: u.youtubeProfile ?? null,
  tiktokProfile: u.tiktokProfile ?? null, snapchatProfile: u.snapchatProfile ?? null,
  instagramFollowers: u.instagramFollowers ?? null, facebookFollowers: u.facebookFollowers ?? null,
  twitterFollowers: u.twitterFollowers ?? null, youtubeFollowers: u.youtubeFollowers ?? null,
  tiktokFollowers: u.tiktokFollowers ?? null, snapchatFollowers: u.snapchatFollowers ?? null,
  websiteUrl: u.websiteUrl ?? null,
  contentCategory: u.contentCategory ?? null, creatorCategory: u.creatorCategory ?? null,
  countryId: u.countryId ?? null, stateId: u.stateId ?? null,
  gems: u.gems, balance: u.balance,
  instagramDayPostPrice: u.instagramDayPostPrice ?? null,
  instagramWeekPostPrice: u.instagramWeekPostPrice ?? null,
  instagramDayStoryPrice: u.instagramDayStoryPrice ?? null,
  instagramWeekStoryPrice: u.instagramWeekStoryPrice ?? null,
  instagramDayReelPrice: u.instagramDayReelPrice ?? null,
  instagramWeekReelPrice: u.instagramWeekReelPrice ?? null,
  instagramDayLivePrice: u.instagramDayLivePrice ?? null,
  instagramWeekLivePrice: u.instagramWeekLivePrice ?? null,
  fbDayPostPrice: u.fbDayPostPrice ?? null,
  fbWeekPostPrice: u.fbWeekPostPrice ?? null,
  tiktokDayPostPrice: u.tiktokDayPostPrice ?? null,
  tiktokWeekPostPrice: u.tiktokWeekPostPrice ?? null,
  youtubeDayPostPrice: u.youtubeDayPostPrice ?? null,
  youtubeWeekPostPrice: u.youtubeWeekPostPrice ?? null,
  twitterDayPostPrice: u.twitterDayPostPrice ?? null,
  twitterWeekPostPrice: u.twitterWeekPostPrice ?? null,
  snapchatDayStoryPrice: u.snapchatDayStoryPrice ?? null,
  snapchatWeekStoryPrice: u.snapchatWeekStoryPrice ?? null,
  createdAt: u.createdAt instanceof Date ? u.createdAt.toISOString() : String(u.createdAt),
});

// ── Profile ─────────────────────────────────────────────────────────────────

router.get("/account/profile", requireAuth, async (req, res): Promise<void> => {
  const [u] = await db.select().from(usersTable).where(eq(usersTable.id, req.userId!));
  if (!u) { res.status(404).json({ error: "User not found" }); return; }
  res.json(userProfileShape(u));
});

router.put("/account/profile", requireAuth, async (req, res): Promise<void> => {
  const allowed = [
    "firstName", "lastName", "userName", "email", "phone", "bio", "avatarUrl", "dob",
    "companyName", "companySize", "companyType", "gender", "countryId", "stateId",
    "instagramProfile", "facebookProfile", "twitterProfile", "youtubeProfile", "tiktokProfile", "snapchatProfile",
    "instagramFollowers", "facebookFollowers", "twitterFollowers", "youtubeFollowers", "tiktokFollowers", "snapchatFollowers",
    "websiteUrl",
    "contentCategory", "creatorCategory",
    "instagramDayPostPrice", "instagramWeekPostPrice", "instagramDayStoryPrice", "instagramWeekStoryPrice",
    "instagramDayReelPrice", "instagramWeekReelPrice", "instagramDayLivePrice", "instagramWeekLivePrice",
    "fbDayPostPrice", "fbWeekPostPrice", "fbDayStoryPrice", "fbWeekStoryPrice",
    "tiktokDayPostPrice", "tiktokWeekPostPrice",
    "youtubeDayPostPrice", "youtubeWeekPostPrice",
    "twitterDayPostPrice", "twitterWeekPostPrice",
    "snapchatDayStoryPrice", "snapchatWeekStoryPrice",
    "contentCreatorRate",
  ];
  const updates: Record<string, unknown> = {};
  for (const key of allowed) {
    if (req.body[key] !== undefined) updates[key] = req.body[key];
  }
  if (Object.keys(updates).length === 0) { res.status(400).json({ error: "No valid fields to update" }); return; }
  const [u] = await db.update(usersTable).set(updates).where(eq(usersTable.id, req.userId!)).returning();
  res.json(userProfileShape(u));
});

// ── Bank Accounts ─────────────────────────────────────────────────────────────

router.get("/account/bank-accounts", requireAuth, async (req, res): Promise<void> => {
  const accounts = await db.select().from(bankAccountsTable)
    .where(eq(bankAccountsTable.userId, req.userId!))
    .orderBy(desc(bankAccountsTable.createdAt));
  res.json(accounts.map(accountShape));
});

router.post("/account/bank-accounts", requireAuth, async (req, res): Promise<void> => {
  const { bankName, bankCode, accountNumber, accountName, isDefault } = req.body;
  if (!bankName || !accountNumber || !accountName) {
    res.status(400).json({ error: "bankName, accountNumber, and accountName are required" }); return;
  }
  if (isDefault) {
    await db.update(bankAccountsTable).set({ isDefault: false }).where(eq(bankAccountsTable.userId, req.userId!));
  }
  const [account] = await db.insert(bankAccountsTable).values({
    userId: req.userId!, bankName, bankCode: bankCode ?? null,
    accountNumber, accountName, isDefault: isDefault ?? false,
  }).returning();
  res.status(201).json(accountShape(account));
});

router.put("/account/bank-accounts/:id/default", requireAuth, async (req, res): Promise<void> => {
  const id = parseInt(req.params.id as string, 10);
  const [account] = await db.select().from(bankAccountsTable).where(
    and(eq(bankAccountsTable.id, id), eq(bankAccountsTable.userId, req.userId!))
  );
  if (!account) { res.status(404).json({ error: "Not found" }); return; }
  await db.update(bankAccountsTable).set({ isDefault: false }).where(eq(bankAccountsTable.userId, req.userId!));
  await db.update(bankAccountsTable).set({ isDefault: true }).where(eq(bankAccountsTable.id, id));
  res.json({ message: "Updated" });
});

router.delete("/account/bank-accounts/:id", requireAuth, async (req, res): Promise<void> => {
  const id = parseInt(req.params.id as string, 10);
  await db.delete(bankAccountsTable).where(
    and(eq(bankAccountsTable.id, id), eq(bankAccountsTable.userId, req.userId!))
  );
  res.json({ message: "Deleted" });
});

// ── Billing Balance ────────────────────────────────────────────────────────────

router.get("/billing/balance", requireAuth, async (req, res): Promise<void> => {
  const [user] = await db.select({ gems: usersTable.gems, balance: usersTable.balance }).from(usersTable).where(eq(usersTable.id, req.userId!));
  const txns = await db.select().from(gemsTransactionsTable)
    .where(eq(gemsTransactionsTable.userId, req.userId!))
    .orderBy(desc(gemsTransactionsTable.createdAt))
    .limit(50);
  res.json({
    gems: user?.gems ?? 0,
    balance: user?.balance ?? "0",
    transactions: txns
      .filter(t => t.type !== "pending")
      .map(t => ({
        id: t.id, type: t.type, gemsDelta: t.gemsDelta,
        amount: t.amount ? parseFloat(String(t.amount)) : null,
        description: t.description ?? null, reference: t.reference ?? null,
        createdAt: t.createdAt instanceof Date ? t.createdAt.toISOString() : String(t.createdAt),
      })),
  });
});

// ── Billing Purchase — uses server-authoritative package catalog ───────────────

router.post("/billing/purchase", requireAuth, async (req, res): Promise<void> => {
  const { packageId, currency = "NGN" } = req.body;

  // Validate against server-side package catalog
  const pkg = packageId ? GEMS_PACKAGES[packageId as string] : null;
  if (!pkg) {
    res.status(400).json({ error: "Invalid packageId. Valid packages: " + Object.keys(GEMS_PACKAGES).join(", ") });
    return;
  }

  const [user] = await db.select({ email: usersTable.email, firstName: usersTable.firstName, lastName: usersTable.lastName }).from(usersTable).where(eq(usersTable.id, req.userId!));
  const [settings] = await db.select({ secretKey: settingsTable.flutterwaveSecretKey, live: settingsTable.flutterwaveLive }).from(settingsTable).limit(1);

  const txRef = `IGT-GEMS-${req.userId}-${packageId}-${Date.now()}`;
  const { gems, amountNGN: amount } = pkg;

  // Store pending purchase record — server is now source of truth for gems/amount
  await db.insert(gemsTransactionsTable).values({
    userId: req.userId!, type: "pending", gemsDelta: gems,
    amount: String(amount), description: `Pending: ${gems} gems for ₦${amount}`, reference: txRef,
  });

  if (!settings?.secretKey) {
    res.status(503).json({ error: "Payment gateway not configured", paymentUrl: null, txRef });
    return;
  }

  try {
    const response = await fetch("https://api.flutterwave.com/v3/payments", {
      method: "POST",
      headers: { "Authorization": `Bearer ${settings.secretKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        tx_ref: txRef, amount, currency,
        redirect_url: `${process.env.APP_URL ?? "https://igotrend.com"}/billing?verify=${txRef}`,
        customer: { email: user.email, name: `${user.firstName} ${user.lastName}` },
        meta: { packageId },
        customizations: { title: "iGoTrend Gems", description: `${gems} gems — ${packageId} package` },
      }),
    });
    const data = await response.json() as { status: string; data?: { link: string }; message?: string };
    if (data.status === "success" && data.data?.link) {
      res.json({ paymentUrl: data.data.link, txRef });
    } else {
      // Clean up pending record on failure
      await db.delete(gemsTransactionsTable).where(eq(gemsTransactionsTable.reference, txRef));
      res.status(502).json({ error: data.message ?? "Payment initiation failed", txRef: null, paymentUrl: null });
    }
  } catch {
    await db.delete(gemsTransactionsTable).where(eq(gemsTransactionsTable.reference, txRef));
    res.status(502).json({ error: "Payment gateway error", txRef: null, paymentUrl: null });
  }
});

// ── Billing Verify — validates against stored pending record ─────────────────

router.post("/billing/verify", requireAuth, async (req, res): Promise<void> => {
  const { txRef } = req.body;
  if (!txRef) { res.status(400).json({ error: "txRef is required" }); return; }

  // Look up the pending record — this is our server-authoritative source of expected gems/amount
  const [pendingRecord] = await db.select()
    .from(gemsTransactionsTable)
    .where(and(eq(gemsTransactionsTable.reference, txRef as string), eq(gemsTransactionsTable.userId, req.userId!)))
    .limit(1);

  if (!pendingRecord) {
    // Check if already completed (idempotency)
    res.status(404).json({ error: "Purchase record not found. Initiate a purchase first." });
    return;
  }

  if (pendingRecord.type !== "pending") {
    res.status(409).json({ error: "Transaction already processed", alreadyProcessed: true });
    return;
  }

  const expectedGems = pendingRecord.gemsDelta;
  const expectedAmount = pendingRecord.amount ? parseFloat(String(pendingRecord.amount)) : 0;

  const [settings] = await db.select({ secretKey: settingsTable.flutterwaveSecretKey }).from(settingsTable).limit(1);
  if (!settings?.secretKey) { res.status(503).json({ error: "Payment gateway not configured" }); return; }

  try {
    const response = await fetch(`https://api.flutterwave.com/v3/transactions/verify_by_reference?tx_ref=${txRef as string}`, {
      headers: { "Authorization": `Bearer ${settings.secretKey}` },
    });
    const data = await response.json() as {
      status: string;
      data?: { status: string; amount?: number; currency?: string; charged_amount?: number }
    };

    if (data.status === "success" && data.data?.status === "successful") {
      const fwAmount = data.data.charged_amount ?? data.data.amount ?? 0;

      // Verify the paid amount matches what was promised (allow small tolerance for FW fees)
      if (fwAmount < expectedAmount * 0.99) {
        res.status(400).json({ error: `Payment amount mismatch: expected ₦${expectedAmount}, received ₦${fwAmount}` });
        return;
      }

      // Final race-condition guard: re-check pending status before updating
      const [recheck] = await db.select({ type: gemsTransactionsTable.type })
        .from(gemsTransactionsTable)
        .where(and(eq(gemsTransactionsTable.reference, txRef as string), eq(gemsTransactionsTable.userId, req.userId!)))
        .limit(1);
      if (!recheck || recheck.type !== "pending") {
        res.status(409).json({ error: "Transaction already processed", alreadyProcessed: true }); return;
      }

      // Credit gems and mark transaction as complete — using server-stored gem value
      const [u] = await db.select({ gems: usersTable.gems }).from(usersTable).where(eq(usersTable.id, req.userId!));
      await db.update(usersTable).set({ gems: (u?.gems ?? 0) + expectedGems }).where(eq(usersTable.id, req.userId!));
      await db.update(gemsTransactionsTable)
        .set({ type: "purchase", description: `Purchased ${expectedGems} gems` })
        .where(eq(gemsTransactionsTable.id, pendingRecord.id));

      res.json({ success: true, gemsAdded: expectedGems });
    } else {
      res.status(400).json({ error: "Payment not successful" });
    }
  } catch {
    res.status(502).json({ error: "Payment verification error" });
  }
});

export default router;
