import { Router, type IRouter } from "express";
import { eq, ilike, and, or, sql } from "drizzle-orm";
import { db, usersTable } from "@workspace/db";

const router: IRouter = Router();

router.get("/public/creators", async (req, res): Promise<void> => {
  const { platform, category, search, page = "1", limit = "24" } = req.query as Record<string, string>;
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(parseInt(limit, 10) || 24, 48);
  const offset = (pageNum - 1) * limitNum;

  const conditions = [eq(usersTable.role, "creator"), eq(usersTable.isActive, true)];

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

export default router;
