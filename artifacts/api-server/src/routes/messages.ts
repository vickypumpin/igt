import { Router } from "express";
import { eq, or, and, sql, desc } from "drizzle-orm";
import { db, messagesTable, usersTable } from "@workspace/db";
import { requireAuth } from "../lib/auth";
import type { IRouter } from "express";

const router: IRouter = Router();

router.get("/messages", requireAuth, async (req, res): Promise<void> => {
  const userId = req.userId!;
  const msgs = await db.select().from(messagesTable)
    .where(or(eq(messagesTable.fromUserId, userId), eq(messagesTable.toUserId, userId)))
    .orderBy(desc(messagesTable.createdAt));

  const conversationMap = new Map<number, typeof msgs[0]>();
  for (const msg of msgs) {
    const otherId = msg.fromUserId === userId ? msg.toUserId : msg.fromUserId;
    if (!conversationMap.has(otherId)) conversationMap.set(otherId, msg);
  }

  const conversations = [];
  for (const [otherId, lastMsg] of conversationMap) {
    const [other] = await db.select().from(usersTable).where(eq(usersTable.id, otherId));
    const [{ unread }] = await db.select({ unread: sql<number>`count(*)` }).from(messagesTable)
      .where(and(eq(messagesTable.toUserId, userId), eq(messagesTable.fromUserId, otherId), eq(messagesTable.isRead, false)));
    conversations.push({
      userId: otherId,
      user: other ? {
        id: other.id, firstName: other.firstName, lastName: other.lastName, userName: other.userName,
        email: other.email, phone: other.phone ?? null, role: other.role, gender: other.gender ?? null,
        badge: other.badge ?? null, isActive: other.isActive, isLocked: other.isLocked,
        countryId: other.countryId ?? null, stateId: other.stateId ?? null,
        companyName: other.companyName ?? null, companySize: other.companySize ?? null, companyType: other.companyType ?? null,
        instagramProfile: null, facebookProfile: null, twitterProfile: null, youtubeProfile: null, tiktokProfile: null, snapchatProfile: null,
        contentCategory: null, creatorCategory: null, gems: 0, balance: 0, bio: null, avatarUrl: other.avatarUrl ?? null,
        createdAt: other.createdAt instanceof Date ? other.createdAt.toISOString() : String(other.createdAt),
      } : null,
      lastMessage: lastMsg.body,
      unreadCount: Number(unread),
      updatedAt: lastMsg.createdAt instanceof Date ? lastMsg.createdAt.toISOString() : String(lastMsg.createdAt),
    });
  }
  res.json(conversations);
});

router.get("/messages/:userId", requireAuth, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;
  const otherId = parseInt(raw, 10);
  const userId = req.userId!;

  await db.update(messagesTable).set({ isRead: true })
    .where(and(eq(messagesTable.fromUserId, otherId), eq(messagesTable.toUserId, userId)));

  const msgs = await db.select({
    id: messagesTable.id, fromUserId: messagesTable.fromUserId, toUserId: messagesTable.toUserId,
    body: messagesTable.body, isRead: messagesTable.isRead, createdAt: messagesTable.createdAt,
    fromFirstName: usersTable.firstName, fromLastName: usersTable.lastName, fromUserName: usersTable.userName, fromAvatar: usersTable.avatarUrl,
  }).from(messagesTable)
    .leftJoin(usersTable, eq(messagesTable.fromUserId, usersTable.id))
    .where(or(
      and(eq(messagesTable.fromUserId, userId), eq(messagesTable.toUserId, otherId)),
      and(eq(messagesTable.fromUserId, otherId), eq(messagesTable.toUserId, userId)),
    )).orderBy(messagesTable.createdAt);

  res.json(msgs.map(m => ({
    id: m.id, fromUserId: m.fromUserId, toUserId: m.toUserId, body: m.body, isRead: m.isRead,
    createdAt: m.createdAt instanceof Date ? m.createdAt.toISOString() : String(m.createdAt),
    fromUser: {
      id: m.fromUserId, firstName: m.fromFirstName ?? "", lastName: m.fromLastName ?? "",
      userName: m.fromUserName ?? "", email: "", phone: null, role: "brand", gender: null, badge: null,
      isActive: true, isLocked: false, countryId: null, stateId: null, companyName: null, companySize: null, companyType: null,
      instagramProfile: null, facebookProfile: null, twitterProfile: null, youtubeProfile: null, tiktokProfile: null, snapchatProfile: null,
      contentCategory: null, creatorCategory: null, gems: 0, balance: 0, bio: null, avatarUrl: m.fromAvatar ?? null,
      createdAt: m.createdAt instanceof Date ? m.createdAt.toISOString() : String(m.createdAt),
    },
  })));
});

router.post("/messages/:userId", requireAuth, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;
  const toUserId = parseInt(raw, 10);
  const { body } = req.body;
  if (!body) { res.status(400).json({ error: "Missing body" }); return; }
  const [msg] = await db.insert(messagesTable).values({ fromUserId: req.userId!, toUserId, body, isRead: false }).returning();
  res.status(201).json({
    id: msg.id, fromUserId: msg.fromUserId, toUserId: msg.toUserId, body: msg.body, isRead: msg.isRead,
    createdAt: msg.createdAt instanceof Date ? msg.createdAt.toISOString() : String(msg.createdAt),
  });
});

export default router;
