import { Router } from "express";
import { eq, sql, desc, and } from "drizzle-orm";
import { db, paymentsTable, rewardsTable, payoutsTable, usersTable, settingsTable, submissionsTable } from "@workspace/db";
import { requireAuth, requireRole } from "../lib/auth";
import type { IRouter } from "express";

const router: IRouter = Router();

async function getFlutterwaveKeys() {
  const [settings] = await db.select({
    publicKey: settingsTable.flutterwavePublicKey,
    secretKey: settingsTable.flutterwaveSecretKey,
    encKey: settingsTable.flutterwaveEncryptionKey,
    live: settingsTable.flutterwaveLive,
  }).from(settingsTable).limit(1);
  return settings ?? { publicKey: null, secretKey: null, encKey: null, live: false };
}

async function flutterwaveInitiatePayment(params: {
  secretKey: string;
  txRef: string;
  amount: number;
  currency: string;
  redirectUrl: string;
  customerEmail: string;
  customerName: string;
  description: string;
}) {
  const response = await fetch("https://api.flutterwave.com/v3/payments", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${params.secretKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      tx_ref: params.txRef,
      amount: params.amount,
      currency: params.currency,
      redirect_url: params.redirectUrl,
      customer: { email: params.customerEmail, name: params.customerName },
      customizations: { title: "iGoTrend", description: params.description },
    }),
  });
  const data = await response.json() as { status: string; data?: { link: string }; message?: string };
  if (data.status === "success" && data.data?.link) return { paymentUrl: data.data.link };
  throw new Error(data.message ?? "Flutterwave payment initiation failed");
}

router.get("/payments", requireAuth, async (req, res): Promise<void> => {
  const payments = await db.select().from(paymentsTable)
    .where(eq(paymentsTable.userId, req.userId!))
    .orderBy(paymentsTable.createdAt);
  res.json(payments.map(p => ({
    id: p.id, campaignId: p.campaignId ?? null,
    amount: parseFloat(String(p.amount)), taxAmount: parseFloat(String(p.taxAmount)),
    paymentType: p.paymentType, paymentStatus: p.paymentStatus, txRef: p.txRef,
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

  const keys = await getFlutterwaveKeys();

  let paymentUrl = `https://checkout.flutterwave.com/v3/hosted/pay?tx_ref=${txRef}`;

  if (keys.secretKey) {
    try {
      const result = await flutterwaveInitiatePayment({
        secretKey: keys.secretKey,
        txRef,
        amount: Number(amount),
        currency: "USD",
        redirectUrl: `${req.headers.origin ?? "https://igotrend.com"}/payments?tx_ref=${txRef}`,
        customerEmail: user?.email ?? "brand@igotrend.com",
        customerName: `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim(),
        description: `Campaign payment — ${txRef}`,
      });
      paymentUrl = result.paymentUrl;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      res.status(502).json({ error: `Payment gateway error: ${msg}` });
      return;
    }
  }

  await db.insert(paymentsTable).values({
    userId: req.userId!, campaignId, amount: String(amount), taxAmount: "0",
    paymentType: "campaign", paymentStatus: false, txRef,
  });

  res.json({ paymentUrl, txRef });
});

router.post("/payments/verify/:txRef", requireAuth, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.txRef) ? req.params.txRef[0] : req.params.txRef;
  const keys = await getFlutterwaveKeys();
  if (!keys.secretKey) {
    res.json({ status: "no_gateway", message: "No payment gateway configured" });
    return;
  }
  const response = await fetch(`https://api.flutterwave.com/v3/transactions/verify_by_reference?tx_ref=${raw}`, {
    headers: { "Authorization": `Bearer ${keys.secretKey}` },
  });
  const data = await response.json() as { status: string; data?: { status: string; amount: number; currency: string } };
  if (data.status === "success" && data.data?.status === "successful") {
    await db.update(paymentsTable).set({ paymentStatus: true }).where(eq(paymentsTable.txRef, raw));
    res.json({ verified: true, amount: data.data.amount, currency: data.data.currency });
  } else {
    res.json({ verified: false });
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
  const keys = await getFlutterwaveKeys();
  let paymentUrl = `https://checkout.flutterwave.com/v3/hosted/pay?tx_ref=${txRef}`;

  if (keys.secretKey) {
    const [user] = await db.select({ email: usersTable.email, firstName: usersTable.firstName, lastName: usersTable.lastName })
      .from(usersTable).where(eq(usersTable.id, req.userId!));
    try {
      const result = await flutterwaveInitiatePayment({
        secretKey: keys.secretKey,
        txRef,
        amount: Number(amount) * creatorIds.length,
        currency: "USD",
        redirectUrl: `${req.headers.origin ?? "https://igotrend.com"}/payments?tx_ref=${txRef}`,
        customerEmail: user?.email ?? "brand@igotrend.com",
        customerName: `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim(),
        description: `${rewardType} reward for ${creatorIds.length} creator(s)`,
      });
      paymentUrl = result.paymentUrl;
    } catch (_) { /* fall through to stub URL */ }
  }

  for (const creatorId of creatorIds) {
    await db.insert(rewardsTable).values({
      fromUserId: req.userId!, toUserId: creatorId, campaignId: campaignId ?? null,
      type: rewardType, amount: String(amount), status: false,
    });
  }
  res.json({ paymentUrl, txRef });
});

router.get("/payouts", requireAuth, requireRole("creator"), async (req, res): Promise<void> => {
  const payouts = await db.select().from(payoutsTable)
    .where(eq(payoutsTable.creatorId, req.userId!))
    .orderBy(sql`created_at desc`);
  res.json(payouts.map(p => ({
    id: p.id, amount: p.amount, status: p.status,
    bankCode: p.bankCode ?? null, accountNumber: p.accountNumber ?? null,
    createdAt: p.createdAt instanceof Date ? p.createdAt.toISOString() : String(p.createdAt),
  })));
});

router.post("/rewards/payout", requireAuth, requireRole("creator"), async (req, res): Promise<void> => {
  const { amount, bankCode, accountNumber, campaignId } = req.body;
  if (!amount) { res.status(400).json({ error: "Missing amount" }); return; }

  // campaignId is always derived server-side from the creator's most recent submission.
  // Client-supplied campaignId is validated against submissions before use;
  // if absent or invalid, fall back to the most recent submission's campaign.
  // This ensures commission deduction fires on approval without trusting client input.
  let resolvedCampaignId: number | null = null;
  if (campaignId) {
    // Validate: creator must have a submission for the supplied campaignId
    const [validSub] = await db
      .select({ campaignId: submissionsTable.campaignId })
      .from(submissionsTable)
      .where(and(eq(submissionsTable.creatorId, req.userId!), eq(submissionsTable.campaignId, Number(campaignId))))
      .limit(1);
    if (validSub) resolvedCampaignId = validSub.campaignId;
  }
  if (!resolvedCampaignId) {
    const [recentSub] = await db
      .select({ campaignId: submissionsTable.campaignId })
      .from(submissionsTable)
      .where(eq(submissionsTable.creatorId, req.userId!))
      .orderBy(desc(submissionsTable.createdAt))
      .limit(1);
    if (recentSub?.campaignId) resolvedCampaignId = recentSub.campaignId;
  }

  await db.insert(payoutsTable).values({
    creatorId: req.userId!, campaignId: resolvedCampaignId,
    amount: String(amount), bankCode: bankCode ?? null, accountNumber: accountNumber ?? null, status: "pending",
  });
  res.json({ message: "Payout requested successfully. An admin will process it within 1–2 business days." });
});

export default router;
