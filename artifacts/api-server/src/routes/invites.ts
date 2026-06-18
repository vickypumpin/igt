import { Router } from "express";
import { eq, and, sql } from "drizzle-orm";
import { db, campaignInvitesTable, campaignsTable, usersTable, gemsTransactionsTable, settingsTable } from "@workspace/db";
import { requireAuth, requireRole } from "../lib/auth";
import { sendEmail, sendSms, tplInviteResponse } from "../lib/notify";
import type { IRouter } from "express";

const router: IRouter = Router();

router.get("/invites", requireAuth, requireRole("creator"), async (req, res): Promise<void> => {
  const { status } = req.query as Record<string, string>;
  const conditions = [eq(campaignInvitesTable.creatorId, req.userId!)];
  if (status) conditions.push(eq(campaignInvitesTable.status, status as "pending" | "active" | "completed" | "declined"));

  const invites = await db.select({
    id: campaignInvitesTable.id,
    campaignId: campaignInvitesTable.campaignId,
    creatorId: campaignInvitesTable.creatorId,
    status: campaignInvitesTable.status,
    source: campaignInvitesTable.source,
    createdAt: campaignInvitesTable.createdAt,
    campaignName: campaignsTable.name,
    campaignSponsor: campaignsTable.sponsor,
    campaignStatus: campaignsTable.status,
    campaignType: campaignsTable.type,
    campaignDuration: campaignsTable.campaignDuration,
    campaignStartDate: campaignsTable.startDate,
    campaignEndDate: campaignsTable.endDate,
    campaignNoOfCreators: campaignsTable.noOfCreators,
    campaignCoverImageUrl: campaignsTable.coverImageUrl,
  }).from(campaignInvitesTable)
    .leftJoin(campaignsTable, eq(campaignInvitesTable.campaignId, campaignsTable.id))
    .where(and(...conditions))
    .orderBy(campaignInvitesTable.createdAt);

  res.json(invites.map(inv => ({
    id: inv.id, campaignId: inv.campaignId, creatorId: inv.creatorId, status: inv.status, source: inv.source ?? "brand",
    estimatedPayout: null,
    createdAt: inv.createdAt instanceof Date ? inv.createdAt.toISOString() : String(inv.createdAt),
    campaign: {
      id: inv.campaignId, name: inv.campaignName ?? "", sponsor: inv.campaignSponsor ?? "",
      description: null, status: inv.campaignStatus ?? "pending",
      type: inv.campaignType ?? "influencer", campaignDuration: inv.campaignDuration ?? "day",
      startDate: inv.campaignStartDate ?? "", endDate: inv.campaignEndDate ?? "",
      noOfCreators: inv.campaignNoOfCreators ?? 1, estimatedBudget: null,
      coverImageUrl: inv.campaignCoverImageUrl ?? null, invitesCount: 0, submissionsCount: 0,
      createdAt: inv.createdAt instanceof Date ? inv.createdAt.toISOString() : String(inv.createdAt),
    },
  })));
});

router.post("/invites/:id/accept", requireAuth, requireRole("creator"), async (req, res): Promise<void> => {
  const id = parseInt(String(req.params.id), 10);

  const [inv] = await db.select({
    inviteId: campaignInvitesTable.id,
    status: campaignInvitesTable.status,
    source: campaignInvitesTable.source,
    campaignId: campaignInvitesTable.campaignId,
    brandId: campaignsTable.brandId,
    campaignName: campaignsTable.name,
    gemsPerCreator: campaignsTable.gemsPerCreator,
  }).from(campaignInvitesTable)
    .leftJoin(campaignsTable, eq(campaignInvitesTable.campaignId, campaignsTable.id))
    .where(and(eq(campaignInvitesTable.id, id), eq(campaignInvitesTable.creatorId, req.userId!)))
    .limit(1);

  if (!inv) { res.status(404).json({ error: "Invite not found" }); return; }
  if ((inv.source ?? "brand") === "creator") {
    res.status(400).json({ error: "You cannot accept your own application — await brand review" }); return;
  }
  if (inv.status !== "pending") { res.status(409).json({ error: "Invite already responded to" }); return; }

  const gemsRequired = inv.gemsPerCreator ?? 0;
  const brandId = inv.brandId!;

  try {
    await db.transaction(async (tx) => {
      if (gemsRequired > 0) {
        const debited = await tx.update(usersTable)
          .set({ gems: sql`gems - ${gemsRequired}` })
          .where(and(eq(usersTable.id, brandId), sql`gems >= ${gemsRequired}`))
          .returning({ id: usersTable.id });
        if (!debited.length) {
          throw Object.assign(new Error("INSUFFICIENT_GEMS"), { code: "INSUFFICIENT_GEMS" });
        }
        await tx.insert(gemsTransactionsTable).values({
          userId: brandId,
          gemsDelta: -gemsRequired,
          type: "reward",
          description: `Gems held for invite – Campaign: ${inv.campaignName ?? inv.campaignId}`,
        });
      }
      await tx.update(campaignInvitesTable)
        .set({ status: "active", updatedAt: new Date() })
        .where(eq(campaignInvitesTable.id, id));
    });
  } catch (err: unknown) {
    if ((err as { code?: string }).code === "INSUFFICIENT_GEMS") {
      res.status(402).json({ error: "Brand has insufficient gems to accept this invite" }); return;
    }
    throw err;
  }

  // Notify brand that creator accepted
  Promise.all([
    db.select({ email: usersTable.email, firstName: usersTable.firstName, lastName: usersTable.lastName, phone: usersTable.phone })
      .from(usersTable).where(eq(usersTable.id, brandId)).limit(1),
    db.select({ firstName: usersTable.firstName, lastName: usersTable.lastName })
      .from(usersTable).where(eq(usersTable.id, req.userId!)).limit(1),
    db.select({ siteName: settingsTable.siteName }).from(settingsTable).limit(1),
  ]).then(([[brand], [creator], [settings]]) => {
    if (!brand || !creator) return;
    const siteName = settings?.siteName ?? "iGoTrend";
    const campaignUrl = `${process.env["APP_BASE_URL"] ?? "https://igotrend.com"}/campaigns/${inv.campaignId}`;
    const creatorName = `${creator.firstName} ${creator.lastName}`.trim();
    const brandFirstName = brand.firstName ?? "there";
    sendEmail(
      brand.email,
      `Creator accepted your campaign invite — ${inv.campaignName}`,
      tplInviteResponse(siteName, brandFirstName, creatorName, inv.campaignName ?? "your campaign", true, campaignUrl),
    ).catch(console.error);
  }).catch(console.error);

  res.json({ message: "Accepted", gemsDebited: gemsRequired });
});

router.post("/invites/:id/decline", requireAuth, requireRole("creator"), async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  const [inv] = await db.select({
    campaignId: campaignInvitesTable.campaignId,
    source: campaignInvitesTable.source,
    brandId: campaignsTable.brandId,
    campaignName: campaignsTable.name,
  }).from(campaignInvitesTable)
    .leftJoin(campaignsTable, eq(campaignInvitesTable.campaignId, campaignsTable.id))
    .where(and(eq(campaignInvitesTable.id, id), eq(campaignInvitesTable.creatorId, req.userId!)))
    .limit(1);

  if ((inv?.source ?? "brand") === "creator") {
    res.status(400).json({ error: "You cannot decline your own application — await brand review" }); return;
  }

  await db.update(campaignInvitesTable).set({ status: "declined", updatedAt: new Date() })
    .where(and(eq(campaignInvitesTable.id, id), eq(campaignInvitesTable.creatorId, req.userId!)));

  // Notify brand that creator declined
  if (inv?.brandId) {
    Promise.all([
      db.select({ email: usersTable.email, firstName: usersTable.firstName })
        .from(usersTable).where(eq(usersTable.id, inv.brandId)).limit(1),
      db.select({ firstName: usersTable.firstName, lastName: usersTable.lastName })
        .from(usersTable).where(eq(usersTable.id, req.userId!)).limit(1),
      db.select({ siteName: settingsTable.siteName }).from(settingsTable).limit(1),
    ]).then(([[brand], [creator], [settings]]) => {
      if (!brand || !creator) return;
      const siteName = settings?.siteName ?? "iGoTrend";
      const campaignUrl = `${process.env["APP_BASE_URL"] ?? "https://igotrend.com"}/campaigns/${inv.campaignId}`;
      const creatorName = `${creator.firstName} ${creator.lastName}`.trim();
      sendEmail(
        brand.email,
        `Creator declined your campaign invite — ${inv.campaignName}`,
        tplInviteResponse(siteName, brand.firstName ?? "there", creatorName, inv.campaignName ?? "your campaign", false, campaignUrl),
      ).catch(console.error);
    }).catch(console.error);
  }

  res.json({ message: "Declined" });
});

export default router;
