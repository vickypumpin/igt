import { Router } from "express";
import { eq } from "drizzle-orm";
import { db, submissionsTable, usersTable, campaignsTable, settingsTable, agenciesTable } from "@workspace/db";
import { requireAuth, requireRole } from "../lib/auth";
import { sendEmail, sendSms, tplSubmissionReceived, tplSubmissionApproved, tplSubmissionRejected, tplAgencySubmission } from "../lib/notify";
import type { IRouter } from "express";

const router: IRouter = Router();

router.post("/submissions", requireAuth, requireRole("creator"), async (req, res): Promise<void> => {
  const { campaignId, screenshotUrl, fileData, fileName, fileType, platform, views, likes, caption } = req.body;
  if (!campaignId) { res.status(400).json({ error: "Missing campaignId" }); return; }
  if (!screenshotUrl && !fileData) { res.status(400).json({ error: "Provide either a URL or upload a file" }); return; }
  const [sub] = await db.insert(submissionsTable).values({
    campaignId, creatorId: req.userId!,
    screenshotUrl: screenshotUrl ?? "",
    fileData: fileData ?? null,
    fileName: fileName ?? null,
    fileType: fileType ?? null,
    platform: platform ?? null,
    views: views ?? null, likes: likes ?? null, caption: caption ?? null,
  }).returning();

  // Notify brand (and agency if applicable) of new submission
  Promise.all([
    db.select({ brandId: campaignsTable.brandId, name: campaignsTable.name })
      .from(campaignsTable).where(eq(campaignsTable.id, Number(campaignId))).limit(1),
    db.select({ firstName: usersTable.firstName, lastName: usersTable.lastName })
      .from(usersTable).where(eq(usersTable.id, req.userId!)).limit(1),
    db.select({ siteName: settingsTable.siteName }).from(settingsTable).limit(1),
  ]).then(async ([[campaign], [creator], [settings]]) => {
    if (!campaign) return;
    const [brand] = await db.select({ email: usersTable.email, firstName: usersTable.firstName, agencyId: usersTable.agencyId })
      .from(usersTable).where(eq(usersTable.id, campaign.brandId)).limit(1);
    if (!brand) return;
    const siteName = settings?.siteName ?? "iGoTrend";
    const dashboardUrl = `${process.env["APP_BASE_URL"] ?? "https://igotrend.com"}/campaigns/${campaignId}`;
    sendEmail(
      brand.email,
      `New submission received — ${campaign.name}`,
      tplSubmissionReceived(siteName, brand.firstName ?? "there", campaign.name, dashboardUrl),
    ).catch(console.error);
    // Also notify agency if brand belongs to one
    if (brand.agencyId && creator) {
      const [agency] = await db.select({ userId: agenciesTable.userId, name: agenciesTable.name }).from(agenciesTable).where(eq(agenciesTable.id, brand.agencyId)).limit(1);
      if (agency) {
        const [agencyUser] = await db.select({ email: usersTable.email }).from(usersTable).where(eq(usersTable.id, agency.userId)).limit(1);
        if (agencyUser?.email) {
          const creatorName = `${creator.firstName ?? ""} ${creator.lastName ?? ""}`.trim();
          sendEmail(
            agencyUser.email,
            `New submission on client campaign — ${campaign.name}`,
            tplAgencySubmission(siteName, agency.name, campaign.name, creatorName, dashboardUrl),
          ).catch(console.error);
        }
      }
    }
  }).catch(console.error);

  res.status(201).json({
    id: sub.id, campaignId: sub.campaignId, creatorId: sub.creatorId,
    screenshotUrl: sub.screenshotUrl, fileData: null, fileName: sub.fileName,
    fileType: sub.fileType, platform: sub.platform, status: sub.status,
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
  const [creator] = await db.select({ firstName: usersTable.firstName, lastName: usersTable.lastName, userName: usersTable.userName, email: usersTable.email, phone: usersTable.phone })
    .from(usersTable).where(eq(usersTable.id, sub.creatorId));

  // Notify creator on approval/rejection
  if ((status === "approved" || status === "rejected") && creator) {
    Promise.all([
      db.select({ name: campaignsTable.name }).from(campaignsTable).where(eq(campaignsTable.id, sub.campaignId)).limit(1),
      db.select({ siteName: settingsTable.siteName }).from(settingsTable).limit(1),
    ]).then(([[campaign], [settings]]) => {
      const siteName = settings?.siteName ?? "iGoTrend";
      const dashboardUrl = `${process.env["APP_BASE_URL"] ?? "https://igotrend.com"}/submissions`;
      const campaignName = campaign?.name ?? "your campaign";
      const creatorFirstName = creator.firstName ?? "there";
      if (status === "approved") {
        sendEmail(
          creator.email,
          `Your submission was approved — ${campaignName}`,
          tplSubmissionApproved(siteName, creatorFirstName, campaignName, dashboardUrl),
        ).catch(console.error);
        if (creator.phone) {
          sendSms(creator.phone, `${siteName}: Your submission for "${campaignName}" was approved! Log in to request your payout.`).catch(console.error);
        }
      } else {
        sendEmail(
          creator.email,
          `Your submission was not approved — ${campaignName}`,
          tplSubmissionRejected(siteName, creatorFirstName, campaignName, dashboardUrl),
        ).catch(console.error);
        if (creator.phone) {
          sendSms(creator.phone, `${siteName}: Your submission for "${campaignName}" was not approved. Log in to review and resubmit.`).catch(console.error);
        }
      }
    }).catch(console.error);
  }

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
