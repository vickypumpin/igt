import { Router } from "express";
import { eq } from "drizzle-orm";
import { db, submissionsTable, usersTable } from "@workspace/db";
import { requireAuth, requireRole } from "../lib/auth";
import type { IRouter } from "express";

const router: IRouter = Router();

router.post("/submissions", requireAuth, requireRole("creator"), async (req, res): Promise<void> => {
  const { campaignId, screenshotUrl, platform, views, likes, caption } = req.body;
  if (!campaignId || !screenshotUrl) { res.status(400).json({ error: "Missing required fields" }); return; }
  const [sub] = await db.insert(submissionsTable).values({
    campaignId, creatorId: req.userId!, screenshotUrl,
    platform: platform ?? null, views: views ?? null, likes: likes ?? null, caption: caption ?? null,
  }).returning();
  res.status(201).json({
    id: sub.id, campaignId: sub.campaignId, creatorId: sub.creatorId,
    screenshotUrl: sub.screenshotUrl, platform: sub.platform, status: sub.status,
    views: sub.views, likes: sub.likes, rating: sub.rating,
    createdAt: sub.createdAt instanceof Date ? sub.createdAt.toISOString() : String(sub.createdAt),
  });
});

router.patch("/submissions/:id", requireAuth, requireRole("brand", "admin"), async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const { status, views, likes, rating, note } = req.body;
  const updates: Record<string, unknown> = {};
  if (status) updates.status = status;
  if (views != null) updates.views = views;
  if (likes != null) updates.likes = likes;
  if (rating != null) updates.rating = rating;
  if (note != null) updates.note = note;
  updates.updatedAt = new Date();
  const [sub] = await db.update(submissionsTable).set(updates).where(eq(submissionsTable.id, id)).returning();
  if (!sub) { res.status(404).json({ error: "Not found" }); return; }
  const [creator] = await db.select({ firstName: usersTable.firstName, lastName: usersTable.lastName, userName: usersTable.userName })
    .from(usersTable).where(eq(usersTable.id, sub.creatorId));
  res.json({
    id: sub.id, campaignId: sub.campaignId, creatorId: sub.creatorId,
    screenshotUrl: sub.screenshotUrl, platform: sub.platform, status: sub.status,
    views: sub.views, likes: sub.likes, rating: sub.rating,
    createdAt: sub.createdAt instanceof Date ? sub.createdAt.toISOString() : String(sub.createdAt),
    creator: creator ? { id: sub.creatorId, firstName: creator.firstName, lastName: creator.lastName, userName: creator.userName,
      badge: null, avatarUrl: null, bio: null, contentCategoryNames: null, creatorCategoryNames: null,
      instagramProfile: null, facebookProfile: null, twitterProfile: null, youtubeProfile: null, tiktokProfile: null, snapchatProfile: null,
      country: null, totalReach: 0, totalEngagement: 0, avgRating: null, campaignsCompleted: 0,
      instagramDayPostPrice: null, instagramWeekPostPrice: null, tiktokDayPostPrice: null, tiktokWeekPostPrice: null,
      youtubeDayPostPrice: null, youtubeWeekPostPrice: null, gems: 0,
    } : null,
  });
});

export default router;
