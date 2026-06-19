import { Router } from "express";
import { eq, ilike, and, sql, desc } from "drizzle-orm";
import { db, usersTable, campaignInvitesTable, submissionsTable, kycRequestsTable, settingsTable } from "@workspace/db";
import { requireAuth, requireRole } from "../lib/auth";
import { formatUser } from "../lib/auth";
import { sendEmail, sendSms, tplNewKycRequest } from "../lib/notify";
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
    verified: u.verified ?? false,
    profilePublic: u.profilePublic ?? true,
    instagramFollowers: u.instagramFollowers ?? null,
    tiktokFollowers: u.tiktokFollowers ?? null,
    youtubeFollowers: u.youtubeFollowers ?? null,
    twitterFollowers: u.twitterFollowers ?? null,
    facebookFollowers: u.facebookFollowers ?? null,
    snapchatFollowers: u.snapchatFollowers ?? null,
  };
}

router.get("/creators", requireAuth, async (req, res): Promise<void> => {
  const { search, badge, page = "1", limit = "20" } = req.query as Record<string, string>;
  const pageNum = parseInt(page, 10) || 1;
  const limitNum = Math.min(parseInt(limit, 10) || 20, 100);
  const offset = (pageNum - 1) * limitNum;

  const conditions = [eq(usersTable.role, "creator"), eq(usersTable.isActive, true), eq(usersTable.profilePublic, true)];
  if (search) conditions.push(ilike(usersTable.userName, `%${search}%`));
  if (badge) conditions.push(eq(usersTable.badge, badge as "nano" | "micro" | "mid_tier" | "macro" | "mega" | "elite"));

  const [creators, [countRow]] = await Promise.all([
    db.select().from(usersTable).where(and(...conditions))
      .orderBy(desc(usersTable.verified))
      .limit(limitNum).offset(offset),
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

// KYC — creator submits identity verification request
router.post("/creator/kyc-request", requireAuth, requireRole("creator"), async (req, res): Promise<void> => {
  const { legalName, country, idType, idNumber, documentUrl } = req.body;
  if (!legalName || !country || !idType || !idNumber || !documentUrl) {
    res.status(400).json({ error: "Missing required fields: legalName, country, idType, idNumber, documentUrl" });
    return;
  }

  const existing = await db.select({ id: kycRequestsTable.id, status: kycRequestsTable.status })
    .from(kycRequestsTable).where(eq(kycRequestsTable.userId, req.userId!)).limit(1);
  if (existing.length) {
    if (existing[0].status === "approved") {
      res.status(409).json({ error: "Your identity is already verified" });
      return;
    }
    if (existing[0].status === "pending") {
      res.status(409).json({ error: "You already have a pending verification request" });
      return;
    }
    // rejected — allow re-submission: update the existing row
    const [updated] = await db.update(kycRequestsTable).set({
      legalName, country,
      idType: idType as "national_id" | "passport" | "drivers_licence",
      idNumber, documentUrl: documentUrl ?? null,
      status: "pending", updatedAt: new Date(),
    }).where(eq(kycRequestsTable.id, existing[0].id)).returning();
    res.json(updated);
    return;
  }

  const [req_] = await db.insert(kycRequestsTable).values({
    userId: req.userId!,
    legalName, country,
    idType: idType as "national_id" | "passport" | "drivers_licence",
    idNumber, documentUrl: documentUrl ?? null,
    status: "pending",
  }).returning();

  // Notify admin of new KYC submission
  Promise.all([
    db.select({ email: usersTable.email, firstName: usersTable.firstName, lastName: usersTable.lastName })
      .from(usersTable).where(eq(usersTable.id, req.userId!)).limit(1),
    db.select({ email: usersTable.email }).from(usersTable).where(eq(usersTable.role, "admin")),
    db.select({ siteName: settingsTable.siteName }).from(settingsTable).limit(1),
  ]).then(([[creator], admins, [settings]]) => {
    if (!creator || !admins.length) return;
    const siteName = settings?.siteName ?? "iGoTrend";
    const appBase = process.env["APP_BASE_URL"] ?? "https://igotrend.com";
    const adminUrl = `${appBase}/admin/kyc`;
    const creatorName = `${creator.firstName ?? ""} ${creator.lastName ?? ""}`.trim() || "a creator";
    for (const admin of admins) {
      sendEmail(
        admin.email,
        `New KYC verification request — ${siteName}`,
        tplNewKycRequest(siteName, creatorName, adminUrl),
      ).catch(console.error);
    }
  }).catch(console.error);

  res.status(201).json(req_);
});

// KYC — creator fetches their own request status
router.get("/creator/kyc-request", requireAuth, requireRole("creator"), async (req, res): Promise<void> => {
  const [existing] = await db.select().from(kycRequestsTable)
    .where(eq(kycRequestsTable.userId, req.userId!)).limit(1);
  if (!existing) { res.status(404).json({ error: "No verification request found" }); return; }
  res.json(existing);
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
