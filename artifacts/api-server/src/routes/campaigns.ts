import { Router } from "express";
import { eq, and, sql } from "drizzle-orm";
import { db, campaignsTable, usersTable, campaignInvitesTable, submissionsTable } from "@workspace/db";
import { requireAuth, requireRole } from "../lib/auth";
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
    estimatedBudget: null,
    coverImageUrl: c.coverImageUrl ?? null,
    invitesCount: Number(c.invitesCount ?? 0),
    submissionsCount: Number(c.submissionsCount ?? 0),
    createdAt: c.createdAt instanceof Date ? c.createdAt.toISOString() : String(c.createdAt),
  };
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
  const updates: Record<string, unknown> = {};
  const allowed = ["name","sponsor","description","kpis","endDate","postCaptionText","handlesHash","dos","donts"];
  for (const f of allowed) { if (req.body[f] != null) updates[f] = req.body[f]; }
  if (req.body.status) updates.status = req.body.status;
  updates.updatedAt = new Date();
  const [campaign] = await db.update(campaignsTable).set(updates).where(eq(campaignsTable.id, id)).returning();
  if (!campaign) { res.status(404).json({ error: "Campaign not found" }); return; }
  res.json(formatCampaign({ ...campaign, invitesCount: 0, submissionsCount: 0 } as unknown as Record<string, unknown>));
});

router.delete("/campaigns/:id", requireAuth, requireRole("brand"), async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  await db.delete(campaignsTable).where(and(eq(campaignsTable.id, id), eq(campaignsTable.brandId, req.userId!)));
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
  const [invite] = await db.insert(campaignInvitesTable).values({ campaignId, creatorId, status: "pending" }).returning();
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

export default router;
