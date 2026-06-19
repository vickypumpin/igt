import { Router, type IRouter } from "express";
import { eq, ilike, and, or, sql, desc } from "drizzle-orm";
import { db, usersTable } from "@workspace/db";

const router: IRouter = Router();

router.get("/public/creators", async (req, res): Promise<void> => {
  const { platform, category, search, page = "1", limit = "24" } = req.query as Record<string, string>;
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(parseInt(limit, 10) || 24, 48);
  const offset = (pageNum - 1) * limitNum;

  const conditions = [eq(usersTable.role, "creator"), eq(usersTable.isActive, true), eq(usersTable.profilePublic, true)];

  if (search) {
    conditions.push(
      or(
        ilike(usersTable.userName, `%${search}%`),
        ilike(usersTable.bio, `%${search}%`)
      )!
    );
  }

  if (category) {
    conditions.push(
      or(
        ilike(usersTable.contentCategory, `%${category}%`),
        ilike(usersTable.creatorCategory, `%${category}%`)
      )!
    );
  }

  if (platform) {
    const col = {
      instagram: usersTable.instagramProfile,
      tiktok: usersTable.tiktokProfile,
      youtube: usersTable.youtubeProfile,
      twitter: usersTable.twitterProfile,
      facebook: usersTable.facebookProfile,
      snapchat: usersTable.snapchatProfile,
    }[platform.toLowerCase()];
    if (col) conditions.push(sql`${col} is not null and ${col} != ''`);
  }

  const [rows, [countRow]] = await Promise.all([
    db.select({
      id: usersTable.id,
      userName: usersTable.userName,
      firstName: usersTable.firstName,
      lastName: usersTable.lastName,
      badge: usersTable.badge,
      avatarUrl: usersTable.avatarUrl,
      bio: usersTable.bio,
      contentCategory: usersTable.contentCategory,
      instagramProfile: usersTable.instagramProfile,
      tiktokProfile: usersTable.tiktokProfile,
      youtubeProfile: usersTable.youtubeProfile,
      twitterProfile: usersTable.twitterProfile,
      facebookProfile: usersTable.facebookProfile,
    }).from(usersTable).where(and(...conditions)).limit(limitNum).offset(offset),
    db.select({ count: sql<number>`count(*)` }).from(usersTable).where(and(...conditions)),
  ]);

  res.json({ data: rows, total: Number(countRow.count), page: pageNum, limit: limitNum });
});

router.get("/public/creators/:username", async (req, res): Promise<void> => {
  const { username } = req.params;
  const [creator] = await db.select({
    id: usersTable.id,
    userName: usersTable.userName,
    firstName: usersTable.firstName,
    lastName: usersTable.lastName,
    badge: usersTable.badge,
    avatarUrl: usersTable.avatarUrl,
    bio: usersTable.bio,
    contentCategory: usersTable.contentCategory,
    creatorCategory: usersTable.creatorCategory,
    verified: usersTable.verified,
    profilePublic: usersTable.profilePublic,
    instagramProfile: usersTable.instagramProfile,
    tiktokProfile: usersTable.tiktokProfile,
    youtubeProfile: usersTable.youtubeProfile,
    twitterProfile: usersTable.twitterProfile,
    facebookProfile: usersTable.facebookProfile,
    snapchatProfile: usersTable.snapchatProfile,
    instagramFollowers: usersTable.instagramFollowers,
    tiktokFollowers: usersTable.tiktokFollowers,
    youtubeFollowers: usersTable.youtubeFollowers,
    twitterFollowers: usersTable.twitterFollowers,
    facebookFollowers: usersTable.facebookFollowers,
    snapchatFollowers: usersTable.snapchatFollowers,
    instagramDayPostPrice: usersTable.instagramDayPostPrice,
    instagramWeekPostPrice: usersTable.instagramWeekPostPrice,
    instagramDayStoryPrice: usersTable.instagramDayStoryPrice,
    instagramWeekStoryPrice: usersTable.instagramWeekStoryPrice,
    instagramDayReelPrice: usersTable.instagramDayReelPrice,
    instagramWeekReelPrice: usersTable.instagramWeekReelPrice,
    tiktokDayPostPrice: usersTable.tiktokDayPostPrice,
    tiktokWeekPostPrice: usersTable.tiktokWeekPostPrice,
    youtubeDayPostPrice: usersTable.youtubeDayPostPrice,
    youtubeWeekPostPrice: usersTable.youtubeWeekPostPrice,
    twitterDayPostPrice: usersTable.twitterDayPostPrice,
    twitterWeekPostPrice: usersTable.twitterWeekPostPrice,
    fbDayPostPrice: usersTable.fbDayPostPrice,
    fbWeekPostPrice: usersTable.fbWeekPostPrice,
    snapchatDayStoryPrice: usersTable.snapchatDayStoryPrice,
    snapchatWeekStoryPrice: usersTable.snapchatWeekStoryPrice,
    contentCreatorRate: usersTable.contentCreatorRate,
  }).from(usersTable)
    .where(and(
      eq(usersTable.userName, username),
      eq(usersTable.role, "creator"),
      eq(usersTable.isActive, true),
      eq(usersTable.profilePublic, true),
    ))
    .limit(1);

  if (!creator) { res.status(404).json({ error: "Creator not found" }); return; }
  res.json(creator);
});

export default router;
