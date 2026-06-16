import { Router } from "express";
import { eq, and, sql } from "drizzle-orm";
import { db, campaignInvitesTable, campaignsTable, usersTable, gemsTransactionsTable } from "@workspace/db";
import { requireAuth, requireRole } from "../lib/auth";
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
    id: inv.id, campaignId: inv.campaignId, creatorId: inv.creatorId, status: inv.status,
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

  // Load invite + campaign together to get gems cost
  const [inv] = await db.select({
    inviteId: campaignInvitesTable.id,
    status: campaignInvitesTable.status,
    campaignId: campaignInvitesTable.campaignId,
    brandId: campaignsTable.brandId,
    campaignName: campaignsTable.name,
    gemsPerCreator: campaignsTable.gemsPerCreator,
  }).from(campaignInvitesTable)
    .leftJoin(campaignsTable, eq(campaignInvitesTable.campaignId, campaignsTable.id))
    .where(and(eq(campaignInvitesTable.id, id), eq(campaignInvitesTable.creatorId, req.userId!)))
    .limit(1);

  if (!inv) { res.status(404).json({ error: "Invite not found" }); return; }
  if (inv.status !== "pending") { res.status(409).json({ error: "Invite already responded to" }); return; }

  const gemsRequired = inv.gemsPerCreator ?? 0;
  const brandId = inv.brandId!;

  try {
    await db.transaction(async (tx) => {
      if (gemsRequired > 0) {
        // Guard: brand must have sufficient gems
        const [brand] = await tx.select({ gems: usersTable.gems })
          .from(usersTable).where(eq(usersTable.id, brandId)).limit(1);
        if (!brand || brand.gems < gemsRequired) {
          throw Object.assign(new Error("INSUFFICIENT_GEMS"), { code: "INSUFFICIENT_GEMS" });
        }
        // Atomically debit brand gems
        await tx.update(usersTable)
          .set({ gems: sql`gems - ${gemsRequired}` })
          .where(eq(usersTable.id, brandId));
        // Record gems transaction for brand
        await tx.insert(gemsTransactionsTable).values({
          userId: brandId,
          gemsDelta: -gemsRequired,
          type: "reward",
          description: `Gems held for invite – Campaign: ${inv.campaignName ?? inv.campaignId}`,
        });
      }
      // Accept the invite
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

  res.json({ message: "Accepted", gemsDebited: gemsRequired });
});

router.post("/invites/:id/decline", requireAuth, requireRole("creator"), async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  await db.update(campaignInvitesTable).set({ status: "declined", updatedAt: new Date() })
    .where(and(eq(campaignInvitesTable.id, id), eq(campaignInvitesTable.creatorId, req.userId!)));
  res.json({ message: "Declined" });
});

export default router;
