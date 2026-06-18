import { Router } from "express";
import { db, notificationsTable, usersTable, messagesTable, settingsTable } from "@workspace/db";
import { eq, or, desc, sql } from "drizzle-orm";
import { requireAuth, requireRole } from "../lib/auth";
import { sendEmail, sendSms } from "../lib/notify";
import type { IRouter } from "express";

const router: IRouter = Router();

function buildBroadcastEmail(siteName: string, message: string, targetUrl: string | null): string {
  const year = new Date().getFullYear();
  const btnHtml = targetUrl
    ? `<p style="margin:24px 0 0;"><a href="${targetUrl}" style="display:inline-block;background:linear-gradient(135deg,#FF8C42,#E47128);color:#fff;text-decoration:none;padding:12px 28px;border-radius:8px;font-weight:bold;font-size:14px;">View</a></p>`
    : "";
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:32px 0;">
    <tr><td align="center">
      <table width="580" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
        <tr><td style="background:linear-gradient(135deg,#FF8C42,#E47128);padding:24px 32px;">
          <span style="color:#fff;font-size:22px;font-weight:bold;">${siteName}</span>
        </td></tr>
        <tr><td style="padding:32px;">
          <h2 style="color:#1a1a1a;font-size:20px;margin:0 0 16px;">Message from ${siteName}</h2>
          <p style="color:#333;font-size:15px;line-height:1.6;margin:8px 0;">${message}</p>
          ${btnHtml}
        </td></tr>
        <tr><td style="padding:16px 32px;border-top:1px solid #eee;text-align:center;">
          <span style="color:#aaa;font-size:12px;">&copy; ${year} ${siteName}. All rights reserved.</span>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

router.get("/admin/messages", requireAuth, requireRole("admin"), async (_req, res): Promise<void> => {
  const msgs = await db.select({
    id: messagesTable.id,
    fromUserId: messagesTable.fromUserId,
    toUserId: messagesTable.toUserId,
    body: messagesTable.body,
    isRead: messagesTable.isRead,
    createdAt: messagesTable.createdAt,
    fromFirst: usersTable.firstName,
    fromLast: usersTable.lastName,
    fromRole: usersTable.role,
  }).from(messagesTable)
    .leftJoin(usersTable, eq(messagesTable.fromUserId, usersTable.id))
    .orderBy(desc(messagesTable.createdAt))
    .limit(100);

  res.json(msgs.map(m => ({
    id: m.id, fromUserId: m.fromUserId, toUserId: m.toUserId, body: m.body, isRead: m.isRead,
    fromName: m.fromFirst ? `${m.fromFirst} ${m.fromLast}` : `User #${m.fromUserId}`,
    fromRole: m.fromRole ?? "unknown",
    createdAt: m.createdAt instanceof Date ? m.createdAt.toISOString() : String(m.createdAt),
  })));
});

router.post("/admin/messages/broadcast", requireAuth, requireRole("admin"), async (req, res): Promise<void> => {
  const { message, targetRole, link } = req.body;
  if (!message) { res.status(400).json({ error: "message is required" }); return; }

  const VALID_ROLES = ["brand", "creator", "agency", "admin"] as const;
  const isValidRole = targetRole && VALID_ROLES.includes(targetRole as typeof VALID_ROLES[number]);
  if (targetRole && !isValidRole) {
    res.status(400).json({ error: `Invalid targetRole. Must be one of: ${VALID_ROLES.join(", ")} or omit for all users.` });
    return;
  }

  const query = db.select({ id: usersTable.id, email: usersTable.email, phone: usersTable.phone }).from(usersTable);
  const users = isValidRole
    ? await query.where(eq(usersTable.role, targetRole as typeof VALID_ROLES[number]))
    : await query;

  if (users.length === 0) { res.json({ sent: 0 }); return; }

  // Insert in-app notifications
  await db.insert(notificationsTable).values(
    users.map(u => ({ userId: u.id, type: "broadcast", message, link: link ?? null }))
  );

  // Fire email + SMS notifications asynchronously
  const [settings] = await db.select({ siteName: settingsTable.siteName }).from(settingsTable).limit(1);
  const siteName = settings?.siteName ?? "iGoTrend";
  const appBase = process.env["APP_BASE_URL"] ?? "https://igotrend.com";
  const targetUrl = link ? (link.startsWith("http") ? link : `${appBase}${link}`) : null;

  const htmlBody = buildBroadcastEmail(siteName, message, targetUrl);

  for (const user of users) {
    sendEmail(user.email, `Announcement from ${siteName}`, htmlBody).catch(console.error);
    if (user.phone) {
      const smsText = targetUrl
        ? `${siteName}: ${message} ${targetUrl}`.slice(0, 160)
        : `${siteName}: ${message}`.slice(0, 160);
      sendSms(user.phone, smsText).catch(console.error);
    }
  }

  res.json({ sent: users.length });
});

export default router;
