import { Router } from "express";
import { eq, sql, and } from "drizzle-orm";
import { db, usersTable, campaignsTable, campaignInvitesTable, submissionsTable, paymentsTable, payoutsTable, verifyRequestsTable } from "@workspace/db";
import { requireAuth, requireRole } from "../lib/auth";
import type { IRouter } from "express";

const router: IRouter = Router();

router.get("/dashboard/brand", requireAuth, requireRole("brand"), async (req, res): Promise<void> => {
  const userId = req.userId!;
  const [stats] = await db.select({
    active: sql<number>`sum(case when status = 'active' then 1 else 0 end)`,
    pending: sql<number>`sum(case when status = 'pending' then 1 else 0 end)`,
    completed: sql<number>`sum(case when status = 'completed' then 1 else 0 end)`,
    declined: sql<number>`sum(case when status = 'declined' then 1 else 0 end)`,
  }).from(campaignsTable).where(eq(campaignsTable.brandId, userId));

  const [inviteCount] = await db.select({ count: sql<number>`count(*)` })
    .from(campaignInvitesTable)
    .leftJoin(campaignsTable, eq(campaignInvitesTable.campaignId, campaignsTable.id))
    .where(eq(campaignsTable.brandId, userId));

  const [spend] = await db.select({ total: sql<number>`coalesce(sum(amount), 0)` })
    .from(paymentsTable)
    .where(and(eq(paymentsTable.userId, userId), eq(paymentsTable.paymentStatus, true)));

  const recentCampaigns = await db.select({
    ...campaignsTable,
    invitesCount: sql<number>`(select count(*) from campaign_invites where campaign_id = campaigns.id)`,
    submissionsCount: sql<number>`(select count(*) from submissions where campaign_id = campaigns.id)`,
  }).from(campaignsTable).where(eq(campaignsTable.brandId, userId))
    .orderBy(sql`created_at desc`).limit(5);

  const topCreators = await db.select().from(usersTable).where(eq(usersTable.role, "creator")).limit(5);

  res.json({
    activeCampaigns: Number(stats?.active ?? 0),
    pendingCampaigns: Number(stats?.pending ?? 0),
    completedCampaigns: Number(stats?.completed ?? 0),
    declinedCampaigns: Number(stats?.declined ?? 0),
    totalCreatorsInvited: Number(inviteCount?.count ?? 0),
    totalSpend: parseFloat(String(spend?.total ?? "0")),
    recentCampaigns: recentCampaigns.map(c => ({
      id: c.id, name: c.name, sponsor: c.sponsor, description: c.description ?? null,
      status: c.status, type: c.type, campaignDuration: c.campaignDuration,
      startDate: c.startDate, endDate: c.endDate, noOfCreators: c.noOfCreators,
      estimatedBudget: null, coverImageUrl: c.coverImageUrl ?? null,
      invitesCount: Number((c as Record<string, unknown>).invitesCount ?? 0),
      submissionsCount: Number((c as Record<string, unknown>).submissionsCount ?? 0),
      createdAt: c.createdAt instanceof Date ? c.createdAt.toISOString() : String(c.createdAt),
    })),
    topCreators: topCreators.map(u => ({
      id: u.id, firstName: u.firstName, lastName: u.lastName, userName: u.userName,
      badge: u.badge ?? null, avatarUrl: u.avatarUrl ?? null, bio: u.bio ?? null,
      contentCategoryNames: u.contentCategory ?? null, creatorCategoryNames: u.creatorCategory ?? null,
      instagramProfile: u.instagramProfile ?? null, facebookProfile: u.facebookProfile ?? null,
      twitterProfile: u.twitterProfile ?? null, youtubeProfile: u.youtubeProfile ?? null,
      tiktokProfile: u.tiktokProfile ?? null, snapchatProfile: u.snapchatProfile ?? null,
      country: null, totalReach: 0, totalEngagement: 0, avgRating: null, campaignsCompleted: 0,
      instagramDayPostPrice: u.instagramDayPostPrice ?? null, instagramWeekPostPrice: u.instagramWeekPostPrice ?? null,
      tiktokDayPostPrice: u.tiktokDayPostPrice ?? null, tiktokWeekPostPrice: u.tiktokWeekPostPrice ?? null,
      youtubeDayPostPrice: u.youtubeDayPostPrice ?? null, youtubeWeekPostPrice: u.youtubeWeekPostPrice ?? null,
      gems: u.gems ?? 0,
    })),
  });
});

router.get("/dashboard/creator", requireAuth, requireRole("creator"), async (req, res): Promise<void> => {
  const userId = req.userId!;
  const [inviteStats] = await db.select({
    total: sql<number>`count(*)`,
    pending: sql<number>`sum(case when status = 'pending' then 1 else 0 end)`,
    completed: sql<number>`sum(case when status = 'completed' then 1 else 0 end)`,
    declined: sql<number>`sum(case when status = 'declined' then 1 else 0 end)`,
  }).from(campaignInvitesTable).where(eq(campaignInvitesTable.creatorId, userId));

  const [submStats] = await db.select({
    totalViews: sql<number>`coalesce(sum(views), 0)`,
    totalLikes: sql<number>`coalesce(sum(likes), 0)`,
  }).from(submissionsTable).where(eq(submissionsTable.creatorId, userId));

  const [user] = await db.select({ gems: usersTable.gems, balance: usersTable.balance })
    .from(usersTable).where(eq(usersTable.id, userId));

  const recentInvites = await db.select({
    id: campaignInvitesTable.id, campaignId: campaignInvitesTable.campaignId,
    creatorId: campaignInvitesTable.creatorId, status: campaignInvitesTable.status, createdAt: campaignInvitesTable.createdAt,
    campaignName: campaignsTable.name, campaignSponsor: campaignsTable.sponsor, campaignStatus: campaignsTable.status,
    campaignType: campaignsTable.type, campaignDuration: campaignsTable.campaignDuration,
    campaignStartDate: campaignsTable.startDate, campaignEndDate: campaignsTable.endDate,
    campaignNoOfCreators: campaignsTable.noOfCreators, campaignCoverImageUrl: campaignsTable.coverImageUrl,
  }).from(campaignInvitesTable)
    .leftJoin(campaignsTable, eq(campaignInvitesTable.campaignId, campaignsTable.id))
    .where(eq(campaignInvitesTable.creatorId, userId))
    .orderBy(sql`campaign_invites.created_at desc`).limit(5);

  res.json({
    totalInvites: Number(inviteStats?.total ?? 0),
    pendingInvites: Number(inviteStats?.pending ?? 0),
    completedCampaigns: Number(inviteStats?.completed ?? 0),
    declinedInvites: Number(inviteStats?.declined ?? 0),
    totalEarnings: parseFloat(String(user?.balance ?? "0")),
    gems: user?.gems ?? 0,
    totalReach: Number(submStats?.totalViews ?? 0),
    totalEngagement: Number(submStats?.totalLikes ?? 0),
    recentInvites: recentInvites.map(inv => ({
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
    })),
  });
});

router.get("/dashboard/admin", requireAuth, requireRole("admin"), async (req, res): Promise<void> => {
  const [[brandCount], [creatorCount], [campaignStats], [revenue], [payouts], [pendingVerify], [pendingCampaigns], [pendingSubs]] = await Promise.all([
    db.select({ count: sql<number>`count(*)` }).from(usersTable).where(eq(usersTable.role, "brand")),
    db.select({ count: sql<number>`count(*)` }).from(usersTable).where(eq(usersTable.role, "creator")),
    db.select({
      active: sql<number>`sum(case when status = 'active' then 1 else 0 end)`,
      completed: sql<number>`sum(case when status = 'completed' then 1 else 0 end)`,
    }).from(campaignsTable),
    db.select({ total: sql<number>`coalesce(sum(amount), 0)` }).from(paymentsTable).where(eq(paymentsTable.paymentStatus, true)),
    db.select({ total: sql<number>`coalesce(sum(amount), 0)` }).from(payoutsTable).where(eq(payoutsTable.status, "approved")),
    db.select({ count: sql<number>`count(*)` }).from(verifyRequestsTable).where(eq(verifyRequestsTable.isApproved, false)),
    db.select({ count: sql<number>`count(*)` }).from(campaignsTable).where(eq(campaignsTable.status, "pending")),
    db.select({ count: sql<number>`count(*)` }).from(submissionsTable).where(eq(submissionsTable.status, "pending")),
  ]);

  res.json({
    totalBrands: Number(brandCount?.count ?? 0),
    totalCreators: Number(creatorCount?.count ?? 0),
    activeCampaigns: Number(campaignStats?.active ?? 0),
    completedCampaigns: Number(campaignStats?.completed ?? 0),
    totalRevenue: parseFloat(String(revenue?.total ?? "0")),
    currentMonthRevenue: 0,
    totalPayout: parseFloat(String(payouts?.total ?? "0")),
    pendingVerifications: Number(pendingVerify?.count ?? 0),
    pendingCampaigns: Number(pendingCampaigns?.count ?? 0),
    pendingSubmissions: Number(pendingSubs?.count ?? 0),
  });
});

export default router;
