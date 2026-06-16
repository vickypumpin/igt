import { Router } from "express";
import { eq } from "drizzle-orm";
import { db, notificationsTable } from "@workspace/db";
import { requireAuth } from "../lib/auth";
import type { IRouter } from "express";

const router: IRouter = Router();

router.get("/notifications", requireAuth, async (req, res): Promise<void> => {
  const notifs = await db.select().from(notificationsTable)
    .where(eq(notificationsTable.userId, req.userId!))
    .orderBy(notificationsTable.createdAt);
  res.json(notifs.map(n => ({
    id: n.id, type: n.type, message: n.message, isRead: n.isRead, link: n.link ?? null,
    createdAt: n.createdAt instanceof Date ? n.createdAt.toISOString() : String(n.createdAt),
  })));
});

router.post("/notifications/read", requireAuth, async (req, res): Promise<void> => {
  await db.update(notificationsTable).set({ isRead: true })
    .where(eq(notificationsTable.userId, req.userId!));
  res.json({ message: "Marked read" });
});

export default router;
