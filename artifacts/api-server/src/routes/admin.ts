import { Router } from "express";
import { eq, and, ilike, sql, desc } from "drizzle-orm";
import { db, usersTable, campaignsTable, submissionsTable, verifyRequestsTable, payoutsTable, commissionDeductionsTable, bankAccountsTable, settingsTable } from "@workspace/db";
import { resolveBilling } from "../lib/billing";
import { initiateDisbursement } from "../lib/gateway";
import { requireAuth, requireRole } from "../lib/auth";
import { formatUser } from "../lib/auth";
import { sendEmail, sendSms, tplPayoutDisbursed, tplCampaignApproved, tplCampaignRejected } from "../lib/notify";
import type { IRouter } from "express";

const router: IRouter = Router();

router.get("/admin/users", requireAuth, requireRole("admin"), async (req, res): Promise<void> => {
  const { role, status, search, page = "1" } = req.query as Record<string, string>;
  const pageNum = parseInt(page, 10) || 1;
  const limit = 20;
  const offset = (pageNum - 1) * limit;

  const conditions = [];
  if (role) conditions.push(eq(usersTable.role, role as "brand" | "creator"));
  if (status === "active") conditions.push(eq(usersTable.isActive, true));
  if (status === "inactive") conditions.push(eq(usersTable.isActive, false));
  if (status === "locked") conditions.push(eq(usersTable.isLocked, true));
  if (search) conditions.push(ilike(usersTable.email, `%${search}%`));

  const where = conditions.length ? and(...conditions) : undefined;
  const [users, [countRow]] = await Promise.all([
    db.select().from(usersTable).where(where).limit(limit).offset(offset),
    db.select({ count: sql<number>`count(*)` }).from(usersTable).where(where),
  ]);
  res.json({ data: users.map(u => formatUser(u as unknown as Record<string, unknown>)), total: Number(countRow.count), page: pageNum, limit });
});

router.patch("/admin/users/:id/status", requireAuth, requireRole("admin"), async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  const { action } = req.body;
  const updates: Record<string, unknown> = { updatedAt: new Date() };
  if (action === "activate") updates.isActive = true;
  if (action === "deactivate") updates.isActive = false;
  if (action === "lock") updates.isLocked = true;
  if (action === "unlock") updates.isLocked = false;
  await db.update(usersTable).set(updates).where(eq(usersTable.id, id));
  res.json({ message: "Updated" });
});

router.get("/admin/campaigns", requireAuth, requireRole("admin"), async (req, res): Promise<void> => {
  const { status } = req.query as Record<string, string>;
  const conditions = [];
  if (status) conditions.push(eq(campaignsTable.status, status as "pending" | "active" | "completed" | "declined"));
  const where = conditions.length ? and(...conditions) : undefined;
  const campaigns = await db.select({
    ...campaignsTable,
    invitesCount: sql<number>`(select count(*) from campaign_invites where campaign_id = campaigns.id)`,
    submissionsCount: sql<number>`(select count(*) from submissions where campaign_id = campaigns.id)`,
  }).from(campaignsTable).where(where).orderBy(sql`created_at desc`);
  res.json(campaigns.map(c => ({
    id: c.id, name: c.name, sponsor: c.sponsor, description: c.description ?? null,
    status: c.status, type: c.type, campaignDuration: c.campaignDuration,
    startDate: c.startDate, endDate: c.endDate, noOfCreators: c.noOfCreators,
    estimatedBudget: null, coverImageUrl: c.coverImageUrl ?? null,
    invitesCount: Number((c as Record<string, unknown>).invitesCount ?? 0),
    submissionsCount: Number((c as Record<string, unknown>).submissionsCount ?? 0),
    createdAt: c.createdAt instanceof Date ? c.createdAt.toISOString() : String(c.createdAt),
  })));
});

router.patch("/admin/campaigns/:id/status", requireAuth, requireRole("admin"), async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  const { status } = req.body;
  const [campaign] = await db.update(campaignsTable).set({ status, updatedAt: new Date() }).where(eq(campaignsTable.id, id)).returning();

  // Notify brand of approval/rejection
  if (campaign && (status === "active" || status === "declined")) {
    Promise.all([
      db.select({ email: usersTable.email, firstName: usersTable.firstName, phone: usersTable.phone })
        .from(usersTable).where(eq(usersTable.id, campaign.brandId)).limit(1),
      db.select({ siteName: settingsTable.siteName }).from(settingsTable).limit(1),
    ]).then(([[brand], [settings]]) => {
      if (!brand) return;
      const siteName = settings?.siteName ?? "iGoTrend";
      const campaignUrl = `${process.env["APP_BASE_URL"] ?? "https://igotrend.com"}/campaigns/${id}`;
      const brandFirstName = brand.firstName ?? "there";
      if (status === "active") {
        sendEmail(
          brand.email,
          `Your campaign was approved — ${campaign.name}`,
          tplCampaignApproved(siteName, brandFirstName, campaign.name, campaignUrl),
        ).catch(console.error);
        if (brand.phone) {
          sendSms(brand.phone, `${siteName}: Your campaign "${campaign.name}" has been approved! Log in to start inviting creators.`).catch(console.error);
        }
      } else {
        sendEmail(
          brand.email,
          `Your campaign was not approved — ${campaign.name}`,
          tplCampaignRejected(siteName, brandFirstName, campaign.name, campaignUrl),
        ).catch(console.error);
      }
    }).catch(console.error);
  }

  res.json({ message: "Updated" });
});

router.get("/admin/verify-requests", requireAuth, requireRole("admin"), async (req, res): Promise<void> => {
  const reqs = await db.select().from(verifyRequestsTable).orderBy(verifyRequestsTable.createdAt);
  res.json(reqs.map(r => ({
    id: r.id, userId: r.userId, accountNumber: r.accountNumber, bankId: r.bankId,
    bankName: r.bankName ?? null, isApproved: r.isApproved,
    createdAt: r.createdAt instanceof Date ? r.createdAt.toISOString() : String(r.createdAt),
  })));
});

router.post("/admin/verify-requests/:id/approve", requireAuth, requireRole("admin"), async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  await db.update(verifyRequestsTable).set({ isApproved: true }).where(eq(verifyRequestsTable.id, id));
  res.json({ message: "Approved" });
});

router.post("/admin/verify-requests/:id/reject", requireAuth, requireRole("admin"), async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  await db.update(verifyRequestsTable).set({ isApproved: false }).where(eq(verifyRequestsTable.id, id));
  res.json({ message: "Rejected" });
});

router.get("/admin/submissions", requireAuth, requireRole("admin"), async (req, res): Promise<void> => {
  const { status } = req.query as Record<string, string>;
  const conditions = [];
  if (status) conditions.push(eq(submissionsTable.status, status as "pending" | "approved" | "rejected"));
  const where = conditions.length ? and(...conditions) : undefined;
  const subs = await db.select().from(submissionsTable).where(where).orderBy(submissionsTable.createdAt);
  res.json(subs.map(s => ({
    id: s.id, campaignId: s.campaignId, creatorId: s.creatorId, screenshotUrl: s.screenshotUrl,
    platform: s.platform ?? null, status: s.status, views: s.views ?? null, likes: s.likes ?? null, rating: s.rating ?? null,
    createdAt: s.createdAt instanceof Date ? s.createdAt.toISOString() : String(s.createdAt),
  })));
});

router.get("/admin/payouts", requireAuth, requireRole("admin"), async (req, res): Promise<void> => {
  const payouts = await db.select({
    id: payoutsTable.id, creatorId: payoutsTable.creatorId, amount: payoutsTable.amount,
    status: payoutsTable.status, gateway: payoutsTable.gateway, transferRef: payoutsTable.transferRef,
    createdAt: payoutsTable.createdAt,
    creatorFirstName: usersTable.firstName, creatorLastName: usersTable.lastName, creatorUserName: usersTable.userName, creatorBadge: usersTable.badge,
  }).from(payoutsTable)
    .leftJoin(usersTable, eq(payoutsTable.creatorId, usersTable.id))
    .orderBy(payoutsTable.createdAt);
  res.json(payouts.map(p => ({
    id: p.id, creatorId: p.creatorId, amount: parseFloat(String(p.amount)),
    status: p.status, gateway: p.gateway ?? null, transferRef: p.transferRef ?? null,
    createdAt: p.createdAt instanceof Date ? p.createdAt.toISOString() : String(p.createdAt),
    creator: {
      id: p.creatorId, firstName: p.creatorFirstName ?? "", lastName: p.creatorLastName ?? "",
      userName: p.creatorUserName ?? "", badge: p.creatorBadge ?? null, avatarUrl: null, bio: null,
      contentCategoryNames: null, creatorCategoryNames: null, instagramProfile: null, facebookProfile: null,
      twitterProfile: null, youtubeProfile: null, tiktokProfile: null, snapchatProfile: null,
      country: null, totalReach: 0, totalEngagement: 0, avgRating: null, campaignsCompleted: 0,
      instagramDayPostPrice: null, instagramWeekPostPrice: null, tiktokDayPostPrice: null, tiktokWeekPostPrice: null,
      youtubeDayPostPrice: null, youtubeWeekPostPrice: null, gems: 0,
    },
  })));
});

router.post("/admin/payouts/:id/approve", requireAuth, requireRole("admin"), async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  const [payout] = await db.select({
    id: payoutsTable.id, creatorId: payoutsTable.creatorId, campaignId: payoutsTable.campaignId,
    amount: payoutsTable.amount, status: payoutsTable.status,
    bankCode: payoutsTable.bankCode, accountNumber: payoutsTable.accountNumber,
  }).from(payoutsTable).where(eq(payoutsTable.id, id));

  if (!payout) { res.status(404).json({ error: "Payout not found" }); return; }
  if (payout.status === "disbursed") { res.json({ message: "Already disbursed" }); return; }
  if (payout.status === "processing") { res.status(409).json({ error: "Payout is already being processed. Please wait." }); return; }

  if (!payout.campaignId) {
    const [campaign] = await db.select({ brandId: campaignsTable.brandId }).from(campaignsTable)
      .innerJoin(submissionsTable, eq(submissionsTable.campaignId, campaignsTable.id))
      .where(eq(submissionsTable.creatorId, payout.creatorId))
      .limit(1);
    if (campaign?.brandId) {
      const billing = await resolveBilling(campaign.brandId);
      if (billing?.billingMode === "commission") {
        res.status(400).json({ error: "Cannot approve: payout has no campaign linkage but brand uses commission billing. Ask the creator to resubmit with a valid campaignId." });
        return;
      }
    }
  }

  let billing: Awaited<ReturnType<typeof resolveBilling>> = null;
  let campaignBrandId: number | null = null;
  if (payout.campaignId) {
    const [campaign] = await db
      .select({ brandId: campaignsTable.brandId })
      .from(campaignsTable)
      .where(eq(campaignsTable.id, payout.campaignId));
    if (campaign?.brandId) {
      campaignBrandId = campaign.brandId;
      billing = await resolveBilling(campaign.brandId);
    }
  }

  const [bankAccount] = await db.select()
    .from(bankAccountsTable)
    .where(and(eq(bankAccountsTable.userId, payout.creatorId), eq(bankAccountsTable.isDefault, true)))
    .limit(1);

  if (!bankAccount) {
    res.status(400).json({ error: "Creator has no default bank account on file. Ask them to add a bank account before disbursing." });
    return;
  }

  const claimed = await db
    .update(payoutsTable)
    .set({ status: "processing" })
    .where(and(eq(payoutsTable.id, id), eq(payoutsTable.status, "pending")))
    .returning({ id: payoutsTable.id });

  if (!claimed.length) {
    const [current] = await db.select({ status: payoutsTable.status })
      .from(payoutsTable).where(eq(payoutsTable.id, id));
    if (current?.status === "disbursed") { res.json({ message: "Already disbursed" }); return; }
    res.status(409).json({ error: "Payout is already being processed by another request." });
    return;
  }

  const disbursementRef = `DISBURSE-${payout.id}`;
  const payoutAmount = parseFloat(String(payout.amount));
  let transferRef: string;
  let usedGateway: string;

  try {
    const result = await initiateDisbursement({
      bankCode: bankAccount.bankCode ?? bankAccount.bankName,
      accountNumber: bankAccount.accountNumber,
      accountName: bankAccount.accountName,
      amount: payoutAmount,
      reference: disbursementRef,
      currency: "NGN",
    });
    transferRef = result.transferRef;
    usedGateway = result.gateway;
  } catch (err) {
    await db.update(payoutsTable)
      .set({ status: "pending" })
      .where(eq(payoutsTable.id, id));
    const msg = err instanceof Error ? err.message : "Disbursement failed";
    res.status(502).json({ error: `Gateway disbursement failed: ${msg}` });
    return;
  }

  await db.transaction(async (tx) => {
    await tx.update(payoutsTable)
      .set({ status: "disbursed", gateway: usedGateway, transferRef })
      .where(eq(payoutsTable.id, id));

    if (payout.campaignId && billing && billing.billingMode === "commission" && billing.commissionRate > 0) {
      const [existing] = await tx.select({ id: commissionDeductionsTable.id })
        .from(commissionDeductionsTable)
        .where(eq(commissionDeductionsTable.payoutId, payout.id));
      if (!existing) {
        const deductionAmount = (payoutAmount * billing.commissionRate) / 100;
        if (deductionAmount > 0) {
          await tx.insert(commissionDeductionsTable).values({
            payoutId: payout.id,
            userId: campaignBrandId,
            agencyId: billing.agencyId,
            campaignId: payout.campaignId,
            deductionPercent: String(billing.commissionRate),
            deductionAmount: String(deductionAmount.toFixed(2)),
          });
        }
      }
    }
  });

  // Notify creator of disbursement
  Promise.all([
    db.select({ email: usersTable.email, firstName: usersTable.firstName, phone: usersTable.phone })
      .from(usersTable).where(eq(usersTable.id, payout.creatorId)).limit(1),
    db.select({ siteName: settingsTable.siteName }).from(settingsTable).limit(1),
  ]).then(([[creator], [settings]]) => {
    if (!creator) return;
    const siteName = settings?.siteName ?? "iGoTrend";
    const payoutsUrl = `${process.env["APP_BASE_URL"] ?? "https://igotrend.com"}/payouts`;
    const amountStr = `₦${payoutAmount.toLocaleString()}`;
    sendEmail(
      creator.email,
      `Payout of ${amountStr} disbursed — ${siteName}`,
      tplPayoutDisbursed(siteName, creator.firstName ?? "there", amountStr, payoutsUrl),
    ).catch(console.error);
    if (creator.phone) {
      sendSms(creator.phone, `${siteName}: Your payout of ${amountStr} has been disbursed to your bank account. Allow 1–3 business days.`).catch(console.error);
    }
  }).catch(console.error);

  res.json({ message: "Approved & disbursed", gateway: usedGateway, transferRef });
});

export default router;
