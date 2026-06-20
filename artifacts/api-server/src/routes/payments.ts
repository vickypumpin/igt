import { Router } from "express";
import { eq, sql, desc, and } from "drizzle-orm";
import { db, paymentsTable, rewardsTable, payoutsTable, usersTable, submissionsTable, kycRequestsTable, bankAccountsTable } from "@workspace/db";
import { requireAuth, requireRole } from "../lib/auth";
import { initiateCollection, verifyCollection } from "../lib/gateway";
import { payoutRateLimiter } from "../middlewares/rateLimiter";
import type { IRouter } from "express";

const router: IRouter = Router();

router.get("/payments", requireAuth, async (req, res): Promise<void> => {
  const payments = await db.select().from(paymentsTable)
    .where(eq(paymentsTable.userId, req.userId!))
    .orderBy(paymentsTable.createdAt);
  res.json(payments.map(p => ({
    id: p.id, campaignId: p.campaignId ?? null,
    amount: parseFloat(String(p.amount)), taxAmount: parseFloat(String(p.taxAmount)),
    paymentType: p.paymentType, paymentStatus: p.paymentStatus, txRef: p.txRef,
    gateway: p.gateway ?? null,
    campaignName: null,
    createdAt: p.createdAt instanceof Date ? p.createdAt.toISOString() : String(p.createdAt),
  })));
});

router.post("/payments/campaign", requireAuth, requireRole("brand"), async (req, res): Promise<void> => {
  const { campaignId, amount = 100 } = req.body;
  if (!campaignId) { res.status(400).json({ error: "Missing campaignId" }); return; }

  const txRef = `IGT-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  const [user] = await db.select({ email: usersTable.email, firstName: usersTable.firstName, lastName: usersTable.lastName })
    .from(usersTable).where(eq(usersTable.id, req.userId!));

  try {
    const { paymentUrl, gateway } = await initiateCollection({
      txRef,
      amount: Number(amount),
      currency: "USD",
      redirectUrl: `${req.headers.origin ?? "https://igotrend.com"}/payments?tx_ref=${txRef}`,
      customerEmail: user?.email ?? "brand@igotrend.com",
      customerName: `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim(),
      description: `Campaign payment — ${txRef}`,
    });

    await db.insert(paymentsTable).values({
      userId: req.userId!, campaignId, amount: String(amount), taxAmount: "0",
      paymentType: "campaign", paymentStatus: false, txRef, gateway,
    });

    res.json({ paymentUrl, txRef, gateway });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Payment gateway error";
    res.status(502).json({ error: msg });
  }
});

router.post("/payments/verify/:txRef", requireAuth, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.txRef) ? req.params.txRef[0] : req.params.txRef;

  // Look up which gateway handled this payment
  const [payment] = await db.select({ gateway: paymentsTable.gateway })
    .from(paymentsTable)
    .where(eq(paymentsTable.txRef, raw))
    .limit(1);

  try {
    const result = await verifyCollection(raw, payment?.gateway ?? null);
    if (result.verified) {
      await db.update(paymentsTable).set({ paymentStatus: true }).where(eq(paymentsTable.txRef, raw));
      res.json({ verified: true, amount: result.amount, currency: result.currency, gateway: payment?.gateway ?? null });
    } else {
      res.json({ verified: false });
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Verification error";
    res.status(502).json({ error: msg });
  }
});

router.get("/rewards", requireAuth, async (req, res): Promise<void> => {
  const rewards = await db.select({
    id: rewardsTable.id, type: rewardsTable.type, amount: rewardsTable.amount,
    status: rewardsTable.status, campaignId: rewardsTable.campaignId, createdAt: rewardsTable.createdAt,
    fromUserName: usersTable.userName,
  }).from(rewardsTable)
    .leftJoin(usersTable, eq(rewardsTable.fromUserId, usersTable.id))
    .where(eq(rewardsTable.toUserId, req.userId!))
    .orderBy(rewardsTable.createdAt);
  res.json(rewards.map(r => ({
    id: r.id, type: r.type, amount: parseFloat(String(r.amount)),
    status: r.status, fromUser: r.fromUserName ?? null, toUser: null, campaignId: r.campaignId ?? null,
    createdAt: r.createdAt instanceof Date ? r.createdAt.toISOString() : String(r.createdAt),
  })));
});

router.post("/rewards", requireAuth, requireRole("brand"), async (req, res): Promise<void> => {
  const { creatorIds, amount, rewardType, campaignId } = req.body;
  if (!creatorIds?.length || !amount || !rewardType) { res.status(400).json({ error: "Missing fields" }); return; }

  const txRef = `RWD-${Date.now()}`;
  const [user] = await db.select({ email: usersTable.email, firstName: usersTable.firstName, lastName: usersTable.lastName })
    .from(usersTable).where(eq(usersTable.id, req.userId!));

  let paymentUrl = "";
  let gateway: string | null = null;

  try {
    const result = await initiateCollection({
      txRef,
      amount: Number(amount) * creatorIds.length,
      currency: "USD",
      redirectUrl: `${req.headers.origin ?? "https://igotrend.com"}/payments?tx_ref=${txRef}`,
      customerEmail: user?.email ?? "brand@igotrend.com",
      customerName: `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim(),
      description: `${rewardType} reward for ${creatorIds.length} creator(s)`,
    });
    paymentUrl = result.paymentUrl;
    gateway = result.gateway;
  } catch (_) { /* fall through — still create the reward records */ }

  for (const creatorId of creatorIds) {
    await db.insert(rewardsTable).values({
      fromUserId: req.userId!, toUserId: creatorId, campaignId: campaignId ?? null,
      type: rewardType, amount: String(amount), status: false,
    });
  }
  res.json({ paymentUrl, txRef, gateway });
});

router.get("/payouts", requireAuth, requireRole("creator"), async (req, res): Promise<void> => {
  const payouts = await db.select().from(payoutsTable)
    .where(eq(payoutsTable.creatorId, req.userId!))
    .orderBy(sql`created_at desc`);
  res.json(payouts.map(p => ({
    id: p.id, amount: p.amount, status: p.status,
    bankCode: p.bankCode ?? null, accountNumber: p.accountNumber ?? null,
    gateway: p.gateway ?? null, transferRef: p.transferRef ?? null,
    createdAt: p.createdAt instanceof Date ? p.createdAt.toISOString() : String(p.createdAt),
  })));
});

router.post("/rewards/payout", requireAuth, requireRole("creator"), payoutRateLimiter, async (req, res): Promise<void> => {
  const { amount, bankCode, accountNumber, campaignId } = req.body;
  if (!amount) { res.status(400).json({ error: "Missing amount" }); return; }

  if (!campaignId) { res.status(400).json({ error: "campaignId is required for a payout request" }); return; }

  // KYC gate: creator must have approved KYC
  const [kyc] = await db.select({ status: kycRequestsTable.status })
    .from(kycRequestsTable)
    .where(eq(kycRequestsTable.userId, req.userId!))
    .limit(1);

  if (!kyc || kyc.status !== "approved") {
    res.status(403).json({
      error: "Your identity must be verified before you can request a payout. Please complete KYC verification first.",
      code: "KYC_REQUIRED",
      redirectTo: "/verify",
    });
    return;
  }

  // Verified bank account gate
  const [defaultBank] = await db.select({ verified: bankAccountsTable.verified, id: bankAccountsTable.id })
    .from(bankAccountsTable)
    .where(and(eq(bankAccountsTable.userId, req.userId!), eq(bankAccountsTable.isDefault, true)))
    .limit(1);

  if (!defaultBank) {
    res.status(403).json({
      error: "You must add a bank account before requesting a payout.",
      code: "NO_BANK_ACCOUNT",
      redirectTo: "/account",
    });
    return;
  }

  if (!defaultBank.verified) {
    res.status(403).json({
      error: "Your bank account must be verified before you can request a payout. Please update your bank account details.",
      code: "BANK_ACCOUNT_NOT_VERIFIED",
      redirectTo: "/account",
    });
    return;
  }

  const [validSub] = await db
    .select({ campaignId: submissionsTable.campaignId })
    .from(submissionsTable)
    .where(and(
      eq(submissionsTable.creatorId, req.userId!),
      eq(submissionsTable.campaignId, Number(campaignId)),
      eq(submissionsTable.status, "approved"),
    ))
    .limit(1);
  if (!validSub) { res.status(400).json({ error: "You have no approved submission for the given campaign" }); return; }

  await db.insert(payoutsTable).values({
    creatorId: req.userId!, campaignId: validSub.campaignId,
    amount: String(amount), bankCode: bankCode ?? null, accountNumber: accountNumber ?? null, status: "pending",
  });
  res.json({ message: "Payout requested successfully. An admin will process it within 1–2 business days." });
});

export default router;
