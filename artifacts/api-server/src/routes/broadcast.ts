import { Router } from "express";
import { db, notificationsTable, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAuth, requireRole } from "../lib/auth";
import type { IRouter } from "express";

const router: IRouter = Router();

router.post("/admin/broadcast", requireAuth, requireRole("admin"), async (req, res): Promise<void> => {
  const { message, targetRole, link } = req.body;
  if (!message) { res.status(400).json({ error: "message is required" }); return; }

  const conditions = [];
  if (targetRole === "brand") conditions.push(eq(usersTable.role, "brand"));
  else if (targetRole === "creator") conditions.push(eq(usersTable.role, "creator"));

  const users = await db.select({ id: usersTable.id }).from(usersTable)
    .where(conditions.length ? conditions[0] : undefined);

  if (users.length === 0) {
    res.json({ sent: 0 });
    return;
  }

  await db.insert(notificationsTable).values(
    users.map(u => ({
      userId: u.id,
      type: "broadcast",
      message,
      link: link ?? null,
    }))
  );

  res.json({ sent: users.length });
});

export default router;
