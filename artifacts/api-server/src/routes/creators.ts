import { Router } from "express";
import { eq, ilike, and, sql } from "drizzle-orm";
import { db, usersTable, campaignInvitesTable, submissionsTable } from "@workspace/db";
import { requireAuth } from "../lib/auth";
import { formatUser } from "../lib/auth";
import type { IRouter } from "express";

const router: IRouter = Router();

function formatCreator(u: Record<string, unknown>, stats?: { totalReach: number; totalEngagement: number; avgRating: number | null; campaignsCompleted: number }) {
  return {
    id: u.id,
    firstName: u.firstName,
    lastName: u.lastName,
    userName: u.userName,
    email: u.email ?? null,
    badge: u.badge ?? null,
    avatarUrl: u.avatarUrl ?? null,
    bio: u.bio ?? null,
    contentCategoryNames: u.contentCategory ?? null,
    creatorCategoryNames: u.creatorCategory ?? null,
    instagramProfile: u.instagramProfile ?? null,
    facebookProfile: u.facebookProfile ?? null,
    twitterProfile: u.twitterProfile ?? null,
    youtubeProfile: u.youtubeProfile ?? null,
    tiktokProfile: u.tiktokProfile ?? null,
    snapchatProfile: u.snapchatProfile ?? null,
    country: u.countryId ? `Country ${u.countryId}` : null,
    totalReach: stats?.totalReach ?? 0,
    totalEngagement: stats?.totalEngagement ?? 0,
    avgRating: stats?.avgRating ?? null,
    campaignsCompleted: stats?.campaignsCompleted ?? 0,
    instagramDayPostPrice: u.instagramDayPostPrice ?? null,
    instagramWeekPostPrice: u.instagramWeekPostPrice ?? null,
    tiktokDayPostPrice: u.tiktokDayPostPrice ?? null,
    tiktokWeekPostPrice: u.tiktokWeekPostPrice ?? null,
    youtubeDayPostPrice: u.youtubeDayPostPrice ?? null,
    youtubeWeekPostPrice: u.youtubeWeekPostPrice ?? null,
    gems: u.gems ?? 0,
  };
}

router.get("/creators", requireAuth, async (req, res): Promise<void> => {
  const { search, badge, page = "1", limit = "20" } = req.query as Record<string, string>;
  const pageNum = parseInt(page, 10) || 1;
  const limitNum = Math.min(parseInt(limit, 10) || 20, 100);
  const offset = (pageNum - 1) * limitNum;

  const conditions = [eq(usersTable.role, "creator"), eq(usersTable.isActive, true)];
  if (search) conditions.push(ilike(usersTable.userName, `%${search}%`));
  if (badge) conditions.push(eq(usersTable.badge, badge as "nano" | "micro" | "mid_tier" | "macro" | "mega" | "elite"));

  const [creators, [countRow]] = await Promise.all([
    db.select().from(usersTable).where(and(...conditions)).limit(limitNum).offset(offset),
    db.select({ count: sql<number>`count(*)` }).from(usersTable).where(and(...conditions)),
  ]);

  const data = creators.map(c => formatCreator(c as unknown as Record<string, unknown>));
  res.json({ data, total: Number(countRow.count), page: pageNum, limit: limitNum });
});

router.get("/creators/stats", requireAuth, async (req, res): Promise<void> => {
  const userId = req.userId!;
  const [inviteStats] = await db.select({
    total: sql<number>`count(*)`,
    completed: sql<number>`sum(case when status = 'completed' then 1 else 0 end)`,
    declined: sql<number>`sum(case when status = 'declined' then 1 else 0 end)`,
  }).from(campaignInvitesTable).where(eq(campaignInvitesTable.creatorId, userId));

  const [submissionStats] = await db.select({
    totalViews: sql<number>`coalesce(sum(views), 0)`,
    totalLikes: sql<number>`coalesce(sum(likes), 0)`,
  }).from(submissionsTable).where(eq(submissionsTable.creatorId, userId));

  const [user] = await db.select({ gems: usersTable.gems, balance: usersTable.balance })
    .from(usersTable).where(eq(usersTable.id, userId));

  res.json({
    totalInvites: Number(inviteStats?.total ?? 0),
    completedCampaigns: Number(inviteStats?.completed ?? 0),
    declinedInvites: Number(inviteStats?.declined ?? 0),
    totalEarnings: parseFloat(String(user?.balance ?? "0")),
    totalGemsReceived: user?.gems ?? 0,
    totalReach: Number(submissionStats?.totalViews ?? 0),
    totalEngagement: Number(submissionStats?.totalLikes ?? 0),
  });
});

router.get("/creators/:id", requireAuth, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  const [creator] = await db.select().from(usersTable).where(and(eq(usersTable.id, id), eq(usersTable.role, "creator")));
  if (!creator) { res.status(404).json({ error: "Creator not found" }); return; }

  const [completedInvites] = await db.select({ count: sql<number>`count(*)` })
    .from(campaignInvitesTable)
    .where(and(eq(campaignInvitesTable.creatorId, id), eq(campaignInvitesTable.status, "completed")));

  res.json(formatCreator(creator as unknown as Record<string, unknown>, {
    totalReach: 0,
    totalEngagement: 0,
    avgRating: null,
    campaignsCompleted: Number(completedInvites?.count ?? 0),
  }));
});

export default router;
