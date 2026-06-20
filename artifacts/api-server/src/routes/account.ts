import { Router } from "express";
import { eq, and, desc, sql } from "drizzle-orm";
import { db, bankAccountsTable, gemsTransactionsTable, usersTable, settingsTable } from "@workspace/db";
import { requireAuth } from "../lib/auth";
import { initiateCollection, verifyCollection, listBanks, resolveAccount } from "../lib/gateway";
import { ObjectStorageService } from "../lib/objectStorage";
import type { IRouter } from "express";

const objectStorageService = new ObjectStorageService();

const AVATAR_ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const AVATAR_MAX_SIZE = 5 * 1024 * 1024;

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
  verified: a.verified ?? false,
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

// ── Avatar Upload ─────────────────────────────────────────────────────────────

router.post("/account/avatar-upload", requireAuth, async (req, res): Promise<void> => {
  const { name, size, contentType } = req.body ?? {};
  if (!name || typeof name !== "string") {
    res.status(400).json({ error: "name is required" }); return;
  }
  if (typeof size !== "number" || size <= 0) {
    res.status(400).json({ error: "size must be a positive number" }); return;
  }
  if (size > AVATAR_MAX_SIZE) {
    res.status(400).json({ error: "File exceeds maximum size of 5 MB" }); return;
  }
  if (!contentType || !AVATAR_ALLOWED_TYPES.includes(contentType as string)) {
    res.status(400).json({ error: `contentType must be one of: ${AVATAR_ALLOWED_TYPES.join(", ")}` }); return;
  }
  try {
    const uploadURL = await objectStorageService.getObjectEntityUploadURL();
    const objectPath = objectStorageService.normalizeObjectEntityPath(uploadURL);
    res.json({ uploadURL, objectPath });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to generate upload URL";
    res.status(500).json({ error: msg });
  }
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

// ── Bank list (Paystack → Flutterwave fallback) — 24h in-memory cache ─────────

let bankListCache: { data: { name: string; code: string }[]; expiresAt: number } | null = null;

router.get("/account/banks", requireAuth, async (_req, res): Promise<void> => {
  const now = Date.now();
  if (bankListCache && bankListCache.expiresAt > now) {
    res.json(bankListCache.data); return;
  }
  try {
    const banks = await listBanks();
    bankListCache = { data: banks, expiresAt: now + 24 * 60 * 60 * 1000 };
    res.json(banks);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to fetch bank list";
    const status = msg.includes("No payment gateway") ? 503 : 502;
    res.status(status).json({ error: msg });
  }
});

// ── Bank account verification (Paystack → Flutterwave fallback) ───────────────

router.post("/account/bank-accounts/verify", requireAuth, async (req, res): Promise<void> => {
  const { accountNumber, bankCode } = req.body;
  if (!accountNumber || !bankCode) {
    res.status(400).json({ error: "accountNumber and bankCode are required" }); return;
  }
  try {
    const accountName = await resolveAccount(String(accountNumber), String(bankCode));
    res.json({ accountName });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Verification failed";
    const status = msg.includes("No payment gateway") ? 503 : 422;
    res.status(status).json({ error: msg });
  }
});

// ── Bank Accounts ─────────────────────────────────────────────────────────────

router.get("/account/bank-accounts", requireAuth, async (req, res): Promise<void> => {
  const accounts = await db.select().from(bankAccountsTable)
    .where(eq(bankAccountsTable.userId, req.userId!))
    .orderBy(desc(bankAccountsTable.createdAt));
  res.json(accounts.map(accountShape));
});

router.post("/account/bank-accounts", requireAuth, async (req, res): Promise<void> => {
  const { bankName, bankCode, accountNumber, isDefault } = req.body;
  if (!bankName || !bankCode || !accountNumber) {
    res.status(400).json({ error: "bankName, bankCode, and accountNumber are required" }); return;
  }
  if (typeof accountNumber !== "string" || !/^\d{10}$/.test(accountNumber)) {
    res.status(400).json({ error: "accountNumber must be exactly 10 digits" }); return;
  }

  // Server-authoritative: always re-verify — never trust client-supplied accountName
  let verifiedAccountName: string;
  try {
    verifiedAccountName = await resolveAccount(accountNumber, String(bankCode));
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Verification failed";
    const status = msg.includes("No payment gateway") ? 503 : 422;
    res.status(status).json({ error: msg }); return;
  }

  if (isDefault) {
    await db.update(bankAccountsTable).set({ isDefault: false }).where(eq(bankAccountsTable.userId, req.userId!));
  }
  const [account] = await db.insert(bankAccountsTable).values({
    userId: req.userId!, bankName: String(bankName), bankCode: String(bankCode),
    accountNumber, accountName: verifiedAccountName, isDefault: isDefault === true,
    verified: true,
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
        gateway: t.gateway ?? null,
        createdAt: t.createdAt instanceof Date ? t.createdAt.toISOString() : String(t.createdAt),
      })),
  });
});

// ── Billing Purchase — uses server-authoritative package catalog ───────────────

router.post("/billing/purchase", requireAuth, async (req, res): Promise<void> => {
  const { packageId } = req.body;
  const currency = "NGN"; // Server-enforced — client currency input is ignored

  // Validate against server-side package catalog
  const pkg = packageId ? GEMS_PACKAGES[packageId as string] : null;
  if (!pkg) {
    res.status(400).json({ error: "Invalid packageId. Valid packages: " + Object.keys(GEMS_PACKAGES).join(", ") });
    return;
  }

  const [user] = await db.select({ email: usersTable.email, firstName: usersTable.firstName, lastName: usersTable.lastName }).from(usersTable).where(eq(usersTable.id, req.userId!));

  const txRef = `IGT-GEMS-${req.userId}-${packageId}-${Date.now()}`;
  const { gems, amountNGN: amount } = pkg;

  // Store pending purchase record — server is now source of truth for gems/amount
  await db.insert(gemsTransactionsTable).values({
    userId: req.userId!, type: "pending", gemsDelta: gems,
    amount: String(amount), description: `Pending: ${gems} gems for ₦${amount}`, reference: txRef,
  });

  try {
    const { paymentUrl, gateway } = await initiateCollection({
      txRef,
      amount,
      currency,
      redirectUrl: `${process.env.APP_URL ?? "https://igotrend.com"}/billing?verify=${txRef}`,
      customerEmail: user?.email ?? "brand@igotrend.com",
      customerName: `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim(),
      description: `${gems} gems — ${packageId} package`,
      meta: { packageId },
    });

    // Store gateway used so verify can call the right provider
    await db.update(gemsTransactionsTable)
      .set({ gateway })
      .where(eq(gemsTransactionsTable.reference, txRef));

    res.json({ paymentUrl, txRef, gateway });
  } catch (err) {
    // Clean up pending record on failure
    await db.delete(gemsTransactionsTable).where(eq(gemsTransactionsTable.reference, txRef));
    const msg = err instanceof Error ? err.message : "Payment gateway error";
    res.status(502).json({ error: msg, txRef: null, paymentUrl: null });
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
    res.status(404).json({ error: "Purchase record not found. Initiate a purchase first." });
    return;
  }

  if (pendingRecord.type !== "pending") {
    res.status(409).json({ error: "Transaction already processed", alreadyProcessed: true });
    return;
  }

  const expectedGems = pendingRecord.gemsDelta;
  const expectedAmount = pendingRecord.amount ? parseFloat(String(pendingRecord.amount)) : 0;

  try {
    const result = await verifyCollection(txRef as string, pendingRecord.gateway ?? null);

    if (!result.verified) {
      res.status(400).json({ error: "Payment not successful" });
      return;
    }

    const fwAmount = result.amount ?? 0;
    const fwCurrency = result.currency ?? "";

    // Validate currency — must be NGN
    if (fwCurrency && fwCurrency !== "NGN") {
      res.status(400).json({ error: `Payment currency mismatch: expected NGN, received ${fwCurrency}` });
      return;
    }

    // Verify the paid amount matches what was promised (allow small tolerance for fees)
    if (fwAmount > 0 && fwAmount < expectedAmount * 0.99) {
      res.status(400).json({ error: `Payment amount mismatch: expected ₦${expectedAmount}, received ₦${fwAmount}` });
      return;
    }

    // Atomic credit inside a DB transaction — conditional UPDATE guards against concurrent verify
    let gemsAdded = 0;
    try {
      await db.transaction(async (tx) => {
        // Atomically mark as 'purchase' ONLY if still 'pending'
        const updated = await tx.update(gemsTransactionsTable)
          .set({ type: "purchase", description: `Purchased ${expectedGems} gems` })
          .where(and(
            eq(gemsTransactionsTable.id, pendingRecord.id),
            eq(gemsTransactionsTable.type, "pending"),
          ))
          .returning({ id: gemsTransactionsTable.id });

        if (!updated.length) {
          throw Object.assign(new Error("ALREADY_PROCESSED"), { code: "ALREADY_PROCESSED" });
        }

        // Atomically credit gems
        await tx.update(usersTable)
          .set({ gems: sql`gems + ${expectedGems}` })
          .where(eq(usersTable.id, req.userId!));

        gemsAdded = expectedGems;
      });
    } catch (txErr: unknown) {
      if ((txErr as { code?: string }).code === "ALREADY_PROCESSED") {
        res.status(409).json({ error: "Transaction already processed", alreadyProcessed: true }); return;
      }
      throw txErr;
    }

    res.json({ success: true, gemsAdded, gateway: pendingRecord.gateway ?? null });
  } catch (err) {
    if (res.headersSent) return;
    const msg = err instanceof Error ? err.message : "Payment verification error";
    res.status(502).json({ error: msg });
  }
});

// ── Settings (read public key for frontend) ──────────────────────────────────
router.get("/billing/gateway-info", requireAuth, async (_req, res): Promise<void> => {
  const [s] = await db.select({
    preferred: settingsTable.preferredPaymentGateway,
    fwPublicKey: settingsTable.flutterwavePublicKey,
    psPublicKey: settingsTable.paystackPublicKey,
  }).from(settingsTable).limit(1);
  res.json({
    preferred: s?.preferred ?? "flutterwave",
    flutterwaveConfigured: !!s?.fwPublicKey,
    paystackConfigured: !!s?.psPublicKey,
  });
});

export default router;
