import { Router } from "express";
import { db, notificationsTable, usersTable, messagesTable } from "@workspace/db";
import { eq, or, desc, sql } from "drizzle-orm";
import { requireAuth, requireRole } from "../lib/auth";
import type { IRouter } from "express";

const router: IRouter = Router();

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

  const query = db.select({ id: usersTable.id }).from(usersTable);
  const users = targetRole === "brand"
    ? await query.where(eq(usersTable.role, "brand"))
    : targetRole === "creator"
    ? await query.where(eq(usersTable.role, "creator"))
    : await query;

  if (users.length === 0) { res.json({ sent: 0 }); return; }

  await db.insert(notificationsTable).values(
    users.map(u => ({ userId: u.id, type: "broadcast", message, link: link ?? null }))
  );

  res.json({ sent: users.length });
});

export default router;
