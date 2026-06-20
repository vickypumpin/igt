import { Router } from "express";
import { eq, and, sql } from "drizzle-orm";
import { db, campaignsTable, usersTable, campaignInvitesTable, submissionsTable, settingsTable, gemsTransactionsTable } from "@workspace/db";
import { requireAuth, requireRole } from "../lib/auth";
import { sendEmail, sendSms, tplCampaignInvite, tplCampaignApproved, tplCampaignRejected, tplApplicationDecision, tplNewApplication } from "../lib/notify";
import type { IRouter } from "express";

const router: IRouter = Router();

function formatCampaign(c: Record<string, unknown>) {
  return {
    id: c.id,
    name: c.name,
    sponsor: c.sponsor,
    description: c.description ?? null,
    status: c.status,
    type: c.type,
    campaignDuration: c.campaignDuration,
    startDate: c.startDate,
    endDate: c.endDate,
    noOfCreators: c.noOfCreators,
    gemsPerCreator: c.gemsPerCreator ?? 0,
    isFunded: c.isFunded ?? false,
    estimatedBudget: null,
    coverImageUrl: c.coverImageUrl ?? null,
    invitesCount: Number(c.invitesCount ?? 0),
    submissionsCount: Number(c.submissionsCount ?? 0),
    createdAt: c.createdAt instanceof Date ? c.createdAt.toISOString() : String(c.createdAt),
  };
}

async function releaseReserve(campaignId: number): Promise<void> {
  const [camp] = await db.select({
    brandId: campaignsTable.brandId,
    isFunded: campaignsTable.isFunded,
    noOfCreators: campaignsTable.noOfCreators,
    gemsPerCreator: campaignsTable.gemsPerCreator,
    name: campaignsTable.name,
  }).from(campaignsTable).where(eq(campaignsTable.id, campaignId)).limit(1);

  if (!camp?.isFunded) return;
  const budget = (camp.noOfCreators ?? 1) * (camp.gemsPerCreator ?? 0);
  if (budget <= 0) return;

  await db.transaction(async (tx) => {
    await tx.update(usersTable).set({
      gems: sql`gems + ${budget}`,
      reservedBalance: sql`GREATEST(reserved_balance - ${budget}, 0)`,
    }).where(eq(usersTable.id, camp.brandId));

    await tx.update(campaignsTable).set({ isFunded: false }).where(eq(campaignsTable.id, campaignId));

    await tx.insert(gemsTransactionsTable).values({
      userId: camp.brandId,
      type: "campaign_refund",
      gemsDelta: budget,
      description: `Campaign Refund: ${camp.name ?? "Campaign"}`,
    });
  });
}

router.get("/campaigns", requireAuth, requireRole("brand", "admin"), async (req, res): Promise<void> => {
  const { status } = req.query as Record<string, string>;
  const conditions = [eq(campaignsTable.brandId, req.userId!)];
  if (status) conditions.push(eq(campaignsTable.status, status as "pending" | "active" | "completed" | "declined"));

  const campaigns = await db.select({
    ...campaignsTable,
    invitesCount: sql<number>`(select count(*) from campaign_invites where campaign_id = campaigns.id)`,
    submissionsCount: sql<number>`(select count(*) from submissions where campaign_id = campaigns.id)`,
  }).from(campaignsTable).where(and(...conditions)).orderBy(sql`created_at desc`);

  res.json(campaigns.map(c => formatCampaign(c as unknown as Record<string, unknown>)));
});

router.post("/campaigns", requireAuth, requireRole("brand"), async (req, res): Promise<void> => {
  const { name, sponsor, description, kpis, type, campaignDuration, startDate, endDate, noOfCreators } = req.body;
  if (!name || !sponsor || !startDate || !endDate) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }
  const vals = {
    brandId: req.userId!,
    name, sponsor, description: description ?? null, kpis: kpis ?? null,
    type: (type ?? "influencer") as "influencer" | "content_creator",
    campaignDuration: (campaignDuration ?? "day") as "day" | "weekly",
    startDate, endDate,
    noOfCreators: noOfCreators ?? 1,
    gemsPerCreator: Math.max(0, parseInt(req.body.gemsPerCreator ?? "0", 10) || 0),
    mood: req.body.mood ?? null, ageRange: req.body.ageRange ?? null,
    campaignCategoryId: req.body.campaignCategoryId ?? null, creatorCategoryId: req.body.creatorCategoryId ?? null,
    noOfDay: req.body.noOfDay ?? null, noOfWeek: req.body.noOfWeek ?? null,
    brandDescription: req.body.brandDescription ?? null, postCaptionText: req.body.postCaptionText ?? null,
    handlesHash: req.body.handlesHash ?? null, dos: req.body.dos ?? null, donts: req.body.donts ?? null,
    dailyInstagramPost: req.body.dailyInstagramPost ?? 0, dailyInstagramStoryPost: req.body.dailyInstagramStoryPost ?? 0,
    dailyInstagramReel: req.body.dailyInstagramReel ?? 0, dailyInstagramLive: req.body.dailyInstagramLive ?? 0,
    dailyFbPost: req.body.dailyFbPost ?? 0, dailyFbStoryPost: req.body.dailyFbStoryPost ?? 0,
    dailyTiktokPost: req.body.dailyTiktokPost ?? 0, dailyYoutubePost: req.body.dailyYoutubePost ?? 0,
    dailyYoutubeVideo: req.body.dailyYoutubeVideo ?? 0, dailyYoutubeShort: req.body.dailyYoutubeShort ?? 0,
    dailyTwitterPost: req.body.dailyTwitterPost ?? 0, dailySnapchatStory: req.body.dailySnapchatStory ?? 0,
    weeklyInstagramPost: req.body.weeklyInstagramPost ?? 0, weeklyInstagramStoryPost: req.body.weeklyInstagramStoryPost ?? 0,
    weeklyInstagramReel: req.body.weeklyInstagramReel ?? 0, weeklyFbPost: req.body.weeklyFbPost ?? 0,
    weeklyTiktokPost: req.body.weeklyTiktokPost ?? 0, weeklyYoutubePost: req.body.weeklyYoutubePost ?? 0,
    weeklyTwitterPost: req.body.weeklyTwitterPost ?? 0, weeklySnapchatStory: req.body.weeklySnapchatStory ?? 0,
  };
  const [campaign] = await db.insert(campaignsTable).values(vals).returning();
  res.status(201).json(formatCampaign({ ...campaign, invitesCount: 0, submissionsCount: 0 } as unknown as Record<string, unknown>));
});

router.get("/campaigns/:id", requireAuth, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  const [campaign] = await db.select({
    ...campaignsTable,
    invitesCount: sql<number>`(select count(*) from campaign_invites where campaign_id = campaigns.id)`,
    submissionsCount: sql<number>`(select count(*) from submissions where campaign_id = campaigns.id)`,
  }).from(campaignsTable).where(eq(campaignsTable.id, id));
  if (!campaign) { res.status(404).json({ error: "Campaign not found" }); return; }

  const invites = await db.select({
    id: campaignInvitesTable.id,
    campaignId: campaignInvitesTable.campaignId,
    creatorId: campaignInvitesTable.creatorId,
    status: campaignInvitesTable.status,
    createdAt: campaignInvitesTable.createdAt,
    creatorFirstName: usersTable.firstName,
    creatorLastName: usersTable.lastName,
    creatorUserName: usersTable.userName,
    creatorBadge: usersTable.badge,
    creatorAvatarUrl: usersTable.avatarUrl,
  }).from(campaignInvitesTable)
    .leftJoin(usersTable, eq(campaignInvitesTable.creatorId, usersTable.id))
    .where(eq(campaignInvitesTable.campaignId, id));

  const c = campaign as unknown as Record<string, unknown>;
  res.json({
    ...formatCampaign(c),
    kpis: c.kpis ?? null, mood: c.mood ?? null, ageRange: c.ageRange ?? null,
    campaignCategoryId: c.campaignCategoryId ?? null, creatorCategoryId: c.creatorCategoryId ?? null,
    noOfDay: c.noOfDay ?? null, noOfWeek: c.noOfWeek ?? null,
    brandDescription: c.brandDescription ?? null, postCaptionText: c.postCaptionText ?? null,
    handlesHash: c.handlesHash ?? null, dos: c.dos ?? null, donts: c.donts ?? null,
    dailyInstagramPost: c.dailyInstagramPost ?? 0, dailyInstagramStoryPost: c.dailyInstagramStoryPost ?? 0,
    dailyInstagramReel: c.dailyInstagramReel ?? 0, dailyInstagramLive: c.dailyInstagramLive ?? 0,
    dailyFbPost: c.dailyFbPost ?? 0, dailyFbStoryPost: c.dailyFbStoryPost ?? 0,
    dailyTiktokPost: c.dailyTiktokPost ?? 0, dailyYoutubePost: c.dailyYoutubePost ?? 0,
    dailyYoutubeVideo: c.dailyYoutubeVideo ?? 0, dailyYoutubeShort: c.dailyYoutubeShort ?? 0,
    dailyTwitterPost: c.dailyTwitterPost ?? 0, dailySnapchatStory: c.dailySnapchatStory ?? 0,
    weeklyInstagramPost: c.weeklyInstagramPost ?? 0, weeklyInstagramStoryPost: c.weeklyInstagramStoryPost ?? 0,
    weeklyInstagramReel: c.weeklyInstagramReel ?? 0, weeklyFbPost: c.weeklyFbPost ?? 0,
    weeklyTiktokPost: c.weeklyTiktokPost ?? 0, weeklyYoutubePost: c.weeklyYoutubePost ?? 0,
    weeklyTwitterPost: c.weeklyTwitterPost ?? 0, weeklySnapchatStory: c.weeklySnapchatStory ?? 0,
    invites: invites.map(inv => ({
      id: inv.id, campaignId: inv.campaignId, creatorId: inv.creatorId, status: inv.status,
      estimatedPayout: null,
      createdAt: inv.createdAt instanceof Date ? inv.createdAt.toISOString() : String(inv.createdAt),
      creator: inv.creatorId ? {
        id: inv.creatorId, firstName: inv.creatorFirstName ?? "", lastName: inv.creatorLastName ?? "",
        userName: inv.creatorUserName ?? "", badge: inv.creatorBadge ?? null, avatarUrl: inv.creatorAvatarUrl ?? null,
        bio: null, contentCategoryNames: null, creatorCategoryNames: null, instagramProfile: null,
        facebookProfile: null, twitterProfile: null, youtubeProfile: null, tiktokProfile: null, snapchatProfile: null,
        country: null, totalReach: 0, totalEngagement: 0, avgRating: null, campaignsCompleted: 0,
        instagramDayPostPrice: null, instagramWeekPostPrice: null, tiktokDayPostPrice: null, tiktokWeekPostPrice: null,
        youtubeDayPostPrice: null, youtubeWeekPostPrice: null, gems: 0,
      } : null,
    })),
  });
});

router.patch("/campaigns/:id", requireAuth, requireRole("brand", "admin"), async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  const newStatus = req.body.status as string | undefined;
  const budgetFieldsChanging = req.body.gemsPerCreator != null || req.body.noOfCreators != null;

  // Always load campaign state when we need it for funding/immutability checks
  const needsExistingLoad = (newStatus === "active" && req.userRole === "brand") ||
    (newStatus === "completed" || newStatus === "declined") ||
    budgetFieldsChanging;

  let existing: { brandId: number; noOfCreators: number | null; gemsPerCreator: number | null; isFunded: boolean | null; name: string | null } | null = null;
  if (needsExistingLoad) {
    const [row] = await db.select({
      brandId: campaignsTable.brandId,
      noOfCreators: campaignsTable.noOfCreators,
      gemsPerCreator: campaignsTable.gemsPerCreator,
      isFunded: campaignsTable.isFunded,
      name: campaignsTable.name,
    }).from(campaignsTable).where(eq(campaignsTable.id, id)).limit(1);
    existing = row ?? null;
    if (!existing) { res.status(404).json({ error: "Campaign not found" }); return; }
  }

  // GUARD 1 (runs BEFORE any money moves): budget immutability on funded campaigns
  if (budgetFieldsChanging && existing?.isFunded) {
    res.status(409).json({
      error: "Cannot change budget on a funded campaign. Cancel the campaign first to release the reserve.",
      code: "BUDGET_IMMUTABLE_WHILE_FUNDED",
    });
    return;
  }

  // GUARD 2: Funding gate — reserve gems when brand publishes (status → active)
  if (newStatus === "active" && req.userRole === "brand" && existing) {
    if (existing.brandId !== req.userId) { res.status(403).json({ error: "Not your campaign" }); return; }

    if (!existing.isFunded) {
      const budget = (existing.noOfCreators ?? 1) * (existing.gemsPerCreator ?? 0);

      if (budget > 0) {
        const [brand] = await db.select({ gems: usersTable.gems }).from(usersTable).where(eq(usersTable.id, existing.brandId)).limit(1);
        const available = brand?.gems ?? 0;

        if (available < budget) {
          const shortfall = budget - available;
          res.status(402).json({
            error: "Insufficient gems to publish campaign",
            code: "INSUFFICIENT_GEMS",
            required: budget,
            available,
            shortfall,
            redirectTo: `/billing?shortfall=${shortfall}`,
          });
          return;
        }

        // Reserve the gems atomically
        await db.transaction(async (tx) => {
          await tx.update(usersTable).set({
            gems: sql`gems - ${budget}`,
            reservedBalance: sql`reserved_balance + ${budget}`,
          }).where(eq(usersTable.id, existing!.brandId));

          await tx.insert(gemsTransactionsTable).values({
            userId: existing!.brandId,
            type: "campaign_reserve",
            gemsDelta: -budget,
            description: `Campaign Reserve: ${existing!.name ?? "Campaign"}`,
          });

          await tx.update(campaignsTable).set({ isFunded: true }).where(eq(campaignsTable.id, id));
        });
      }
    }
  }

  // GUARD 3: Refund reserve on cancel/complete — fail closed to protect financial integrity
  if ((newStatus === "completed" || newStatus === "declined") && req.userRole !== "brand") {
    await releaseReserve(id);
  }

  const updates: Record<string, unknown> = {};
  const allowed = ["name","sponsor","description","kpis","endDate","postCaptionText","handlesHash","dos","donts","gemsPerCreator","noOfCreators"];
  for (const f of allowed) { if (req.body[f] != null) updates[f] = req.body[f]; }
  if (newStatus) updates.status = newStatus;
  updates.updatedAt = new Date();
  const [campaign] = await db.update(campaignsTable).set(updates).where(eq(campaignsTable.id, id)).returning();
  if (!campaign) { res.status(404).json({ error: "Campaign not found" }); return; }

  // Notify brand of status change (approved / rejected) — admin route uses this too
  if (newStatus === "active" || newStatus === "declined") {
    Promise.all([
      db.select({ email: usersTable.email, firstName: usersTable.firstName, phone: usersTable.phone })
        .from(usersTable).where(eq(usersTable.id, campaign.brandId)).limit(1),
      db.select({ siteName: settingsTable.siteName }).from(settingsTable).limit(1),
    ]).then(([[brand], [settings]]) => {
      if (!brand) return;
      const siteName = settings?.siteName ?? "iGoTrend";
      const campaignUrl = `${process.env["APP_BASE_URL"] ?? "https://igotrend.com"}/campaigns/${id}`;
      const brandFirstName = brand.firstName ?? "there";
      if (newStatus === "active") {
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

  res.json(formatCampaign({ ...campaign, invitesCount: 0, submissionsCount: 0 } as unknown as Record<string, unknown>));
});

router.delete("/campaigns/:id", requireAuth, requireRole("brand"), async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  // Verify ownership FIRST before any state mutation
  const [existing] = await db.select({ brandId: campaignsTable.brandId })
    .from(campaignsTable).where(eq(campaignsTable.id, id)).limit(1);
  if (!existing) { res.status(404).json({ error: "Campaign not found" }); return; }
  if (existing.brandId !== req.userId) { res.status(403).json({ error: "Not your campaign" }); return; }

  // Now safe to release reserved gems and delete — fail closed if release fails
  try {
    await releaseReserve(id);
  } catch (err) {
    res.status(500).json({ error: "Failed to release campaign reserve. Please try again." });
    return;
  }
  await db.delete(campaignsTable).where(eq(campaignsTable.id, id));
  res.json({ message: "Deleted" });
});

// Campaign invites
router.get("/campaigns/:id/invites", requireAuth, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const campaignId = parseInt(raw, 10);
  const invites = await db.select({
    id: campaignInvitesTable.id,
    campaignId: campaignInvitesTable.campaignId,
    creatorId: campaignInvitesTable.creatorId,
    status: campaignInvitesTable.status,
    createdAt: campaignInvitesTable.createdAt,
    creatorFirstName: usersTable.firstName,
    creatorLastName: usersTable.lastName,
    creatorUserName: usersTable.userName,
    creatorBadge: usersTable.badge,
    creatorAvatarUrl: usersTable.avatarUrl,
  }).from(campaignInvitesTable)
    .leftJoin(usersTable, eq(campaignInvitesTable.creatorId, usersTable.id))
    .where(eq(campaignInvitesTable.campaignId, campaignId));
  res.json(invites.map(inv => ({
    id: inv.id, campaignId: inv.campaignId, creatorId: inv.creatorId, status: inv.status,
    estimatedPayout: null,
    createdAt: inv.createdAt instanceof Date ? inv.createdAt.toISOString() : String(inv.createdAt),
    creator: {
      id: inv.creatorId, firstName: inv.creatorFirstName ?? "", lastName: inv.creatorLastName ?? "",
      userName: inv.creatorUserName ?? "", badge: inv.creatorBadge ?? null, avatarUrl: inv.creatorAvatarUrl ?? null,
      bio: null, contentCategoryNames: null, creatorCategoryNames: null, instagramProfile: null,
      facebookProfile: null, twitterProfile: null, youtubeProfile: null, tiktokProfile: null, snapchatProfile: null,
      country: null, totalReach: 0, totalEngagement: 0, avgRating: null, campaignsCompleted: 0,
      instagramDayPostPrice: null, instagramWeekPostPrice: null, tiktokDayPostPrice: null, tiktokWeekPostPrice: null,
      youtubeDayPostPrice: null, youtubeWeekPostPrice: null, gems: 0,
    },
  })));
});

router.post("/campaigns/:id/invites", requireAuth, requireRole("brand"), async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const campaignId = parseInt(raw, 10);
  const { creatorId } = req.body;
  if (!creatorId) { res.status(400).json({ error: "Missing creatorId" }); return; }

  // Capacity enforcement: cannot invite more than noOfCreators
  const [campaignMeta] = await db.select({
    noOfCreators: campaignsTable.noOfCreators,
    gemsPerCreator: campaignsTable.gemsPerCreator,
    isFunded: campaignsTable.isFunded,
    brandId: campaignsTable.brandId,
    name: campaignsTable.name,
  }).from(campaignsTable).where(eq(campaignsTable.id, campaignId)).limit(1);

  if (!campaignMeta) { res.status(404).json({ error: "Campaign not found" }); return; }
  if (campaignMeta.brandId !== req.userId) { res.status(403).json({ error: "Not your campaign" }); return; }

  const [countRow] = await db.select({ count: sql<number>`count(*)` })
    .from(campaignInvitesTable)
    .where(eq(campaignInvitesTable.campaignId, campaignId));
  const currentInvites = Number(countRow?.count ?? 0);
  const maxInvites = campaignMeta.noOfCreators ?? 1;

  if (currentInvites >= maxInvites) {
    res.status(400).json({
      error: `Campaign is at full capacity. You have already invited ${currentInvites} of ${maxInvites} creators.`,
      code: "CAMPAIGN_AT_CAPACITY",
      current: currentInvites,
      max: maxInvites,
    });
    return;
  }

  const [invite] = await db.insert(campaignInvitesTable).values({ campaignId, creatorId, status: "pending" }).returning();

  // Notify creator of invite
  Promise.all([
    db.select({ name: campaignsTable.name, brandId: campaignsTable.brandId })
      .from(campaignsTable).where(eq(campaignsTable.id, campaignId)).limit(1),
    db.select({ email: usersTable.email, firstName: usersTable.firstName, phone: usersTable.phone })
      .from(usersTable).where(eq(usersTable.id, Number(creatorId))).limit(1),
    db.select({ siteName: settingsTable.siteName }).from(settingsTable).limit(1),
  ]).then(async ([[campaign], [creator], [settings]]) => {
    if (!campaign || !creator) return;
    const [brand] = await db.select({ firstName: usersTable.firstName, lastName: usersTable.lastName, companyName: usersTable.companyName })
      .from(usersTable).where(eq(usersTable.id, campaign.brandId)).limit(1);
    const siteName = settings?.siteName ?? "iGoTrend";
    const invitesUrl = `${process.env["APP_BASE_URL"] ?? "https://igotrend.com"}/invites`;
    const rawName = `${brand?.firstName ?? ""} ${brand?.lastName ?? ""}`.trim();
    const brandDisplayName = brand?.companyName ?? (rawName || siteName);
    sendEmail(
      creator.email,
      `You've been invited to "${campaign.name}" on ${siteName}`,
      tplCampaignInvite(siteName, creator.firstName ?? "there", campaign.name, brandDisplayName, invitesUrl),
    ).catch(console.error);
    if (creator.phone) {
      sendSms(creator.phone, `${siteName}: ${brandDisplayName} has invited you to join the campaign "${campaign.name}". Log in to view the invitation.`).catch(console.error);
    }
  }).catch(console.error);

  res.status(201).json({
    id: invite.id, campaignId: invite.campaignId, creatorId: invite.creatorId, status: invite.status,
    estimatedPayout: null,
    createdAt: invite.createdAt instanceof Date ? invite.createdAt.toISOString() : String(invite.createdAt),
  });
});

router.delete("/campaigns/:id/invites/:inviteId", requireAuth, requireRole("brand"), async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.inviteId) ? req.params.inviteId[0] : req.params.inviteId;
  const inviteId = parseInt(raw, 10);
  await db.delete(campaignInvitesTable).where(eq(campaignInvitesTable.id, inviteId));
  res.json({ message: "Removed" });
});

// Campaign submissions
router.get("/campaigns/:id/submissions", requireAuth, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const campaignId = parseInt(raw, 10);
  const subs = await db.select({
    id: submissionsTable.id,
    campaignId: submissionsTable.campaignId,
    creatorId: submissionsTable.creatorId,
    screenshotUrl: submissionsTable.screenshotUrl,
    platform: submissionsTable.platform,
    status: submissionsTable.status,
    views: submissionsTable.views,
    likes: submissionsTable.likes,
    rating: submissionsTable.rating,
    createdAt: submissionsTable.createdAt,
    creatorFirstName: usersTable.firstName,
    creatorLastName: usersTable.lastName,
    creatorUserName: usersTable.userName,
    creatorBadge: usersTable.badge,
    creatorAvatarUrl: usersTable.avatarUrl,
  }).from(submissionsTable)
    .leftJoin(usersTable, eq(submissionsTable.creatorId, usersTable.id))
    .where(eq(submissionsTable.campaignId, campaignId));
  res.json(subs.map(s => ({
    id: s.id, campaignId: s.campaignId, creatorId: s.creatorId,
    screenshotUrl: s.screenshotUrl, platform: s.platform ?? null,
    status: s.status, views: s.views ?? null, likes: s.likes ?? null, rating: s.rating ?? null,
    createdAt: s.createdAt instanceof Date ? s.createdAt.toISOString() : String(s.createdAt),
    creator: {
      id: s.creatorId, firstName: s.creatorFirstName ?? "", lastName: s.creatorLastName ?? "",
      userName: s.creatorUserName ?? "", badge: s.creatorBadge ?? null, avatarUrl: s.creatorAvatarUrl ?? null,
      bio: null, contentCategoryNames: null, creatorCategoryNames: null, instagramProfile: null,
      facebookProfile: null, twitterProfile: null, youtubeProfile: null, tiktokProfile: null, snapchatProfile: null,
      country: null, totalReach: 0, totalEngagement: 0, avgRating: null, campaignsCompleted: 0,
      instagramDayPostPrice: null, instagramWeekPostPrice: null, tiktokDayPostPrice: null, tiktokWeekPostPrice: null,
      youtubeDayPostPrice: null, youtubeWeekPostPrice: null, gems: 0,
    },
  })));
});

router.get("/campaigns/:id/budget", requireAuth, async (req, res): Promise<void> => {
  res.json({ estimated: 0, perCreator: [] });
});

// Campaigns where this creator has at least one approved submission — used for payout campaign selection
router.get("/creator/eligible-campaigns", requireAuth, requireRole("creator"), async (req, res): Promise<void> => {
  const rows = await db.select({
    campaignId: submissionsTable.campaignId,
    campaignName: campaignsTable.name,
    sponsor: campaignsTable.sponsor,
  }).from(submissionsTable)
    .innerJoin(campaignsTable, eq(submissionsTable.campaignId, campaignsTable.id))
    .where(and(
      eq(submissionsTable.creatorId, req.userId!),
      eq(submissionsTable.status, "approved"),
    ))
    .groupBy(submissionsTable.campaignId, campaignsTable.name, campaignsTable.sponsor);
  res.json(rows);
});

// All active campaigns a creator has NOT been invited to yet — for Discover tab
router.get("/creator/discover-campaigns", requireAuth, requireRole("creator"), async (req, res): Promise<void> => {
  const creatorId = req.userId!;

  const alreadyInvited = db.select({ cid: campaignInvitesTable.campaignId })
    .from(campaignInvitesTable)
    .where(eq(campaignInvitesTable.creatorId, creatorId));

  const campaigns = await db.select({
    id: campaignsTable.id,
    name: campaignsTable.name,
    sponsor: campaignsTable.sponsor,
    description: campaignsTable.description,
    type: campaignsTable.type,
    campaignDuration: campaignsTable.campaignDuration,
    campaignCategoryId: campaignsTable.campaignCategoryId,
    startDate: campaignsTable.startDate,
    endDate: campaignsTable.endDate,
    noOfCreators: campaignsTable.noOfCreators,
    gemsPerCreator: campaignsTable.gemsPerCreator,
    coverImageUrl: campaignsTable.coverImageUrl,
    createdAt: campaignsTable.createdAt,
  }).from(campaignsTable)
    .where(and(
      eq(campaignsTable.status, "active"),
      sql`${campaignsTable.id} not in (${alreadyInvited})`,
    ))
    .orderBy(sql`${campaignsTable.createdAt} desc`);

  res.json(campaigns.map(c => ({
    id: c.id,
    name: c.name,
    sponsor: c.sponsor,
    description: c.description ?? null,
    type: c.type,
    campaignDuration: c.campaignDuration,
    campaignCategoryId: c.campaignCategoryId ?? null,
    startDate: c.startDate,
    endDate: c.endDate,
    noOfCreators: c.noOfCreators,
    gemsPerCreator: c.gemsPerCreator ?? null,
    coverImageUrl: c.coverImageUrl ?? null,
    createdAt: c.createdAt instanceof Date ? c.createdAt.toISOString() : String(c.createdAt),
  })));
});

// Brand approves a creator application (source='creator', status='pending') → active
router.post("/campaigns/:id/applications/:inviteId/approve", requireAuth, requireRole("brand"), async (req, res): Promise<void> => {
  const campaignId = parseInt(String(req.params.id), 10);
  const inviteId = parseInt(String(req.params.inviteId), 10);
  if (isNaN(campaignId) || isNaN(inviteId)) { res.status(400).json({ error: "Invalid ids" }); return; }

  const [campaign] = await db.select({ id: campaignsTable.id, brandId: campaignsTable.brandId, name: campaignsTable.name, gemsPerCreator: campaignsTable.gemsPerCreator })
    .from(campaignsTable).where(eq(campaignsTable.id, campaignId)).limit(1);
  if (!campaign) { res.status(404).json({ error: "Campaign not found" }); return; }
  if (campaign.brandId !== req.userId) { res.status(403).json({ error: "Not your campaign" }); return; }

  const [inv] = await db.select({ id: campaignInvitesTable.id, status: campaignInvitesTable.status, source: campaignInvitesTable.source, creatorId: campaignInvitesTable.creatorId })
    .from(campaignInvitesTable)
    .where(and(eq(campaignInvitesTable.id, inviteId), eq(campaignInvitesTable.campaignId, campaignId)))
    .limit(1);
  if (!inv) { res.status(404).json({ error: "Application not found" }); return; }
  if ((inv.source ?? "brand") !== "creator") { res.status(400).json({ error: "This is a brand invite, not a creator application" }); return; }
  if (inv.status !== "pending") { res.status(409).json({ error: "Application already decided" }); return; }

  const gemsRequired = campaign.gemsPerCreator ?? 0;
  try {
    await db.transaction(async (tx) => {
      if (gemsRequired > 0) {
        const debited = await tx.update(usersTable)
          .set({ gems: sql`gems - ${gemsRequired}` })
          .where(and(eq(usersTable.id, campaign.brandId!), sql`gems >= ${gemsRequired}`))
          .returning({ id: usersTable.id });
        if (!debited.length) throw Object.assign(new Error("INSUFFICIENT_GEMS"), { code: "INSUFFICIENT_GEMS" });
      }
      await tx.update(campaignInvitesTable).set({ status: "active", updatedAt: new Date() }).where(eq(campaignInvitesTable.id, inviteId));
    });
  } catch (err: unknown) {
    if ((err as { code?: string }).code === "INSUFFICIENT_GEMS") { res.status(402).json({ error: "Insufficient gems" }); return; }
    throw err;
  }

  // Notify creator
  Promise.all([
    db.select({ email: usersTable.email, firstName: usersTable.firstName, phone: usersTable.phone }).from(usersTable).where(eq(usersTable.id, inv.creatorId)).limit(1),
    db.select({ siteName: settingsTable.siteName }).from(settingsTable).limit(1),
  ]).then(([[creator], [settings]]) => {
    if (!creator) return;
    const siteName = settings?.siteName ?? "iGoTrend";
    const campaignsUrl = `${process.env["APP_BASE_URL"] ?? "https://igotrend.com"}/campaigns`;
    sendEmail(creator.email, `Your application was approved — ${campaign.name}`, tplApplicationDecision(siteName, creator.firstName ?? "there", campaign.name ?? "the campaign", true, campaignsUrl)).catch(console.error);
    if (creator.phone) {
      sendSms(creator.phone, `${siteName}: Great news! Your application for "${campaign.name ?? "a campaign"}" has been approved. Check your campaigns dashboard.`).catch(console.error);
    }
  }).catch(console.error);

  res.json({ message: "Application approved" });
});

// Brand rejects a creator application
router.post("/campaigns/:id/applications/:inviteId/reject", requireAuth, requireRole("brand"), async (req, res): Promise<void> => {
  const campaignId = parseInt(String(req.params.id), 10);
  const inviteId = parseInt(String(req.params.inviteId), 10);
  if (isNaN(campaignId) || isNaN(inviteId)) { res.status(400).json({ error: "Invalid ids" }); return; }

  const [campaign] = await db.select({ id: campaignsTable.id, brandId: campaignsTable.brandId, name: campaignsTable.name })
    .from(campaignsTable).where(eq(campaignsTable.id, campaignId)).limit(1);
  if (!campaign) { res.status(404).json({ error: "Campaign not found" }); return; }
  if (campaign.brandId !== req.userId) { res.status(403).json({ error: "Not your campaign" }); return; }

  const [inv] = await db.select({ id: campaignInvitesTable.id, status: campaignInvitesTable.status, source: campaignInvitesTable.source, creatorId: campaignInvitesTable.creatorId })
    .from(campaignInvitesTable)
    .where(and(eq(campaignInvitesTable.id, inviteId), eq(campaignInvitesTable.campaignId, campaignId)))
    .limit(1);
  if (!inv) { res.status(404).json({ error: "Application not found" }); return; }
  if ((inv.source ?? "brand") !== "creator") { res.status(400).json({ error: "This is a brand invite, not a creator application" }); return; }
  if (inv.status !== "pending") { res.status(409).json({ error: "Application already decided" }); return; }

  await db.update(campaignInvitesTable).set({ status: "declined", updatedAt: new Date() }).where(eq(campaignInvitesTable.id, inviteId));

  // Notify creator
  Promise.all([
    db.select({ email: usersTable.email, firstName: usersTable.firstName, phone: usersTable.phone }).from(usersTable).where(eq(usersTable.id, inv.creatorId)).limit(1),
    db.select({ siteName: settingsTable.siteName }).from(settingsTable).limit(1),
  ]).then(([[creator], [settings]]) => {
    if (!creator) return;
    const siteName = settings?.siteName ?? "iGoTrend";
    const campaignsUrl = `${process.env["APP_BASE_URL"] ?? "https://igotrend.com"}/campaigns`;
    sendEmail(creator.email, `Your application was not approved — ${campaign.name}`, tplApplicationDecision(siteName, creator.firstName ?? "there", campaign.name ?? "the campaign", false, campaignsUrl)).catch(console.error);
    if (creator.phone) {
      sendSms(creator.phone, `${siteName}: Your application for "${campaign.name ?? "a campaign"}" was not selected this time. Discover more campaigns on your dashboard.`).catch(console.error);
    }
  }).catch(console.error);

  res.json({ message: "Application rejected" });
});

// Creator applies to a campaign — creates an invite with pending status
router.post("/creator/campaigns/:id/apply", requireAuth, requireRole("creator"), async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const campaignId = parseInt(raw, 10);
  if (isNaN(campaignId)) { res.status(400).json({ error: "Invalid campaign id" }); return; }

  const [campaign] = await db.select({ id: campaignsTable.id, status: campaignsTable.status, name: campaignsTable.name })
    .from(campaignsTable).where(eq(campaignsTable.id, campaignId)).limit(1);
  if (!campaign) { res.status(404).json({ error: "Campaign not found" }); return; }
  if (campaign.status !== "active") { res.status(400).json({ error: "Campaign is not open for applications" }); return; }

  const [existing] = await db.select({ id: campaignInvitesTable.id })
    .from(campaignInvitesTable)
    .where(and(eq(campaignInvitesTable.campaignId, campaignId), eq(campaignInvitesTable.creatorId, req.userId!)))
    .limit(1);
  if (existing) { res.status(409).json({ error: "Already applied to this campaign" }); return; }

  const [invite] = await db.insert(campaignInvitesTable).values({
    campaignId,
    creatorId: req.userId!,
    status: "pending",
    source: "creator",
  }).returning();

  // Notify brand of new creator application
  Promise.all([
    db.select({ brandId: campaignsTable.brandId }).from(campaignsTable).where(eq(campaignsTable.id, campaignId)).limit(1),
    db.select({ firstName: usersTable.firstName, lastName: usersTable.lastName, userName: usersTable.userName })
      .from(usersTable).where(eq(usersTable.id, req.userId!)).limit(1),
    db.select({ siteName: settingsTable.siteName }).from(settingsTable).limit(1),
  ]).then(async ([[camp], [creator], [settings]]) => {
    if (!camp) return;
    const [brand] = await db.select({ email: usersTable.email, firstName: usersTable.firstName })
      .from(usersTable).where(eq(usersTable.id, camp.brandId)).limit(1);
    if (!brand) return;
    const siteName = settings?.siteName ?? "iGoTrend";
    const campaignUrl = `${process.env["APP_BASE_URL"] ?? "https://igotrend.com"}/campaigns/${campaignId}`;
    const creatorDisplayName = creator
      ? (`${creator.firstName ?? ""} ${creator.lastName ?? ""}`.trim() || creator.userName)
      : "A creator";
    sendEmail(
      brand.email,
      `New application for "${campaign.name ?? "your campaign"}" — ${siteName}`,
      tplNewApplication(siteName, brand.firstName ?? "there", creatorDisplayName, campaign.name ?? "your campaign", campaignUrl),
    ).catch(console.error);
  }).catch(console.error);

  res.status(201).json({
    id: invite.id,
    campaignId: invite.campaignId,
    creatorId: invite.creatorId,
    status: invite.status,
    createdAt: invite.createdAt instanceof Date ? invite.createdAt.toISOString() : String(invite.createdAt),
  });
});

export default router;
