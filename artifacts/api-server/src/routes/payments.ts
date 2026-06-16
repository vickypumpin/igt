import { Router } from "express";
import { eq } from "drizzle-orm";
import { db, paymentsTable, rewardsTable, payoutsTable, usersTable } from "@workspace/db";
import { requireAuth, requireRole } from "../lib/auth";
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
    campaignName: null,
    createdAt: p.createdAt instanceof Date ? p.createdAt.toISOString() : String(p.createdAt),
  })));
});

router.post("/payments/campaign", requireAuth, requireRole("brand"), async (req, res): Promise<void> => {
  const { campaignId } = req.body;
  if (!campaignId) { res.status(400).json({ error: "Missing campaignId" }); return; }
  const txRef = `IGT-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  await db.insert(paymentsTable).values({
    userId: req.userId!, campaignId, amount: "0", taxAmount: "0",
    paymentType: "campaign", paymentStatus: false, txRef,
  });
  res.json({ paymentUrl: `https://checkout.flutterwave.com/v3/hosted/pay?tx_ref=${txRef}`, txRef });
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
  for (const creatorId of creatorIds) {
    await db.insert(rewardsTable).values({
      fromUserId: req.userId!, toUserId: creatorId, campaignId: campaignId ?? null,
      type: rewardType, amount: String(amount), status: false,
    });
  }
  res.json({ paymentUrl: `https://checkout.flutterwave.com/v3/hosted/pay?tx_ref=${txRef}`, txRef });
});

router.post("/rewards/payout", requireAuth, requireRole("creator"), async (req, res): Promise<void> => {
  const { amount, bankCode, accountNumber } = req.body;
  if (!amount) { res.status(400).json({ error: "Missing amount" }); return; }
  await db.insert(payoutsTable).values({
    creatorId: req.userId!, amount: String(amount),
    bankCode: bankCode ?? null, accountNumber: accountNumber ?? null, status: "pending",
  });
  res.json({ message: "Payout requested" });
});

export default router;
