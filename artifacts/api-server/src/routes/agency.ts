import { Router } from "express";
import { eq, and, sql } from "drizzle-orm";
import { db, usersTable, agenciesTable, agencyClientsTable, campaignsTable } from "@workspace/db";
import { requireAuth, requireRole } from "../lib/auth";
import type { IRouter } from "express";

const router: IRouter = Router();

router.get("/agency/me", requireAuth, requireRole("agency"), async (req, res): Promise<void> => {
  const [agency] = await db.select().from(agenciesTable).where(eq(agenciesTable.userId, req.userId!));
  if (!agency) { res.status(404).json({ error: "Agency not found" }); return; }
  res.json(agency);
});

router.put("/agency/me", requireAuth, requireRole("agency"), async (req, res): Promise<void> => {
  const [agency] = await db.select().from(agenciesTable).where(eq(agenciesTable.userId, req.userId!));
  if (!agency) { res.status(404).json({ error: "Agency not found" }); return; }
  const { name, logoUrl, contactName, contactEmail, contactPhone } = req.body;
  const updates: Record<string, unknown> = {};
  if (name !== undefined) updates.name = name;
  if (logoUrl !== undefined) updates.logoUrl = logoUrl;
  if (contactName !== undefined) updates.contactName = contactName;
  if (contactEmail !== undefined) updates.contactEmail = contactEmail;
  if (contactPhone !== undefined) updates.contactPhone = contactPhone;
  const [updated] = await db.update(agenciesTable).set(updates).where(eq(agenciesTable.id, agency.id)).returning();
  res.json(updated);
});

router.get("/agency/clients", requireAuth, requireRole("agency"), async (req, res): Promise<void> => {
  const [agency] = await db.select().from(agenciesTable).where(eq(agenciesTable.userId, req.userId!));
  if (!agency) { res.status(404).json({ error: "Agency not found" }); return; }
  const clients = await db
    .select({
      id: agencyClientsTable.id,
      agencyId: agencyClientsTable.agencyId,
      brandUserId: agencyClientsTable.brandUserId,
      inviteStatus: agencyClientsTable.inviteStatus,
      invitedAt: agencyClientsTable.invitedAt,
      joinedAt: agencyClientsTable.joinedAt,
      firstName: usersTable.firstName,
      lastName: usersTable.lastName,
      email: usersTable.email,
      companyName: usersTable.companyName,
      isActive: usersTable.isActive,
      billingMode: usersTable.billingMode,
      commissionRate: usersTable.commissionRate,
    })
    .from(agencyClientsTable)
    .leftJoin(usersTable, eq(agencyClientsTable.brandUserId, usersTable.id))
    .where(eq(agencyClientsTable.agencyId, agency.id));
  res.json(clients);
});

router.post("/agency/clients/invite", requireAuth, requireRole("agency"), async (req, res): Promise<void> => {
  const { email } = req.body;
  if (!email) { res.status(400).json({ error: "Email is required" }); return; }
  const [agency] = await db.select().from(agenciesTable).where(eq(agenciesTable.userId, req.userId!));
  if (!agency) { res.status(404).json({ error: "Agency not found" }); return; }
  const [brand] = await db.select({ id: usersTable.id, role: usersTable.role }).from(usersTable).where(eq(usersTable.email, email));
  if (!brand) { res.status(404).json({ error: "No user found with that email" }); return; }
  if (brand.role !== "brand") { res.status(400).json({ error: "User must be a brand account" }); return; }
  const [existing] = await db.select({ id: agencyClientsTable.id }).from(agencyClientsTable)
    .where(and(eq(agencyClientsTable.agencyId, agency.id), eq(agencyClientsTable.brandUserId, brand.id)));
  if (existing) { res.status(400).json({ error: "Already invited" }); return; }
  const [client] = await db.insert(agencyClientsTable).values({
    agencyId: agency.id, brandUserId: brand.id, inviteStatus: "pending",
  }).returning();
  res.status(201).json(client);
});

router.patch("/agency/clients/:id/respond", requireAuth, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  const { action } = req.body;
  if (action !== "accept" && action !== "decline") {
    res.status(400).json({ error: "action must be 'accept' or 'decline'" }); return;
  }
  const [invite] = await db.select().from(agencyClientsTable).where(eq(agencyClientsTable.id, id));
  if (!invite) { res.status(404).json({ error: "Invite not found" }); return; }
  if (invite.brandUserId !== req.userId) {
    res.status(403).json({ error: "Forbidden" }); return;
  }
  if (action === "accept") {
    await Promise.all([
      db.update(agencyClientsTable).set({ inviteStatus: "accepted", joinedAt: new Date() }).where(eq(agencyClientsTable.id, id)),
      db.update(usersTable).set({ agencyId: invite.agencyId }).where(eq(usersTable.id, invite.brandUserId)),
    ]);
  } else {
    await db.update(agencyClientsTable).set({ inviteStatus: "declined" }).where(eq(agencyClientsTable.id, id));
  }
  res.json({ message: action === "accept" ? "Invite accepted" : "Invite declined" });
});

router.delete("/agency/clients/:id", requireAuth, requireRole("agency"), async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  const [agency] = await db.select().from(agenciesTable).where(eq(agenciesTable.userId, req.userId!));
  if (!agency) { res.status(403).json({ error: "Forbidden" }); return; }
  const [row] = await db.select({ agencyId: agencyClientsTable.agencyId, brandUserId: agencyClientsTable.brandUserId })
    .from(agencyClientsTable).where(eq(agencyClientsTable.id, id));
  if (!row || row.agencyId !== agency.id) { res.status(403).json({ error: "Forbidden" }); return; }
  await Promise.all([
    db.delete(agencyClientsTable).where(eq(agencyClientsTable.id, id)),
    db.update(usersTable).set({ agencyId: null }).where(eq(usersTable.id, row.brandUserId)),
  ]);
  res.json({ message: "Removed" });
});

router.get("/agency/campaigns", requireAuth, requireRole("agency"), async (req, res): Promise<void> => {
  const [agency] = await db.select().from(agenciesTable).where(eq(agenciesTable.userId, req.userId!));
  if (!agency) { res.status(404).json({ error: "Agency not found" }); return; }
  const clients = await db.select({
    brandUserId: agencyClientsTable.brandUserId,
    companyName: usersTable.companyName,
    firstName: usersTable.firstName,
    lastName: usersTable.lastName,
    email: usersTable.email,
  })
    .from(agencyClientsTable)
    .leftJoin(usersTable, eq(agencyClientsTable.brandUserId, usersTable.id))
    .where(and(eq(agencyClientsTable.agencyId, agency.id), eq(agencyClientsTable.inviteStatus, "accepted")));
  const clientIds = clients.map(c => c.brandUserId);
  if (!clientIds.length) { res.json([]); return; }
  const clientMap = new Map(clients.map(c => [c.brandUserId, c]));
  const campaigns = await db.select({
    id: campaignsTable.id,
    name: campaignsTable.name,
    sponsor: campaignsTable.sponsor,
    status: campaignsTable.status,
    type: campaignsTable.type,
    noOfCreators: campaignsTable.noOfCreators,
    startDate: campaignsTable.startDate,
    endDate: campaignsTable.endDate,
    coverImageUrl: campaignsTable.coverImageUrl,
    brandId: campaignsTable.brandId,
    createdAt: campaignsTable.createdAt,
    submissionsCount: sql<number>`(select count(*) from submissions where campaign_id = campaigns.id)`,
  }).from(campaignsTable)
    .where(sql`campaigns.brand_id = ANY(ARRAY[${sql.raw(clientIds.join(","))}]::int[])`)
    .orderBy(sql`campaigns.created_at desc`);
  const result = campaigns.map(c => ({
    ...c,
    client: clientMap.get(c.brandId ?? 0) ?? null,
  }));
  res.json(result);
});

router.get("/agency/dashboard", requireAuth, requireRole("agency"), async (req, res): Promise<void> => {
  const [agency] = await db.select().from(agenciesTable).where(eq(agenciesTable.userId, req.userId!));
  if (!agency) { res.status(404).json({ error: "Agency not found" }); return; }

  const [clientCountRow] = await db.select({ count: sql<number>`count(*)` }).from(agencyClientsTable)
    .where(and(eq(agencyClientsTable.agencyId, agency.id), eq(agencyClientsTable.inviteStatus, "accepted")));
  const [pendingCountRow] = await db.select({ count: sql<number>`count(*)` }).from(agencyClientsTable)
    .where(and(eq(agencyClientsTable.agencyId, agency.id), eq(agencyClientsTable.inviteStatus, "pending")));

  const acceptedClients = await db.select({ brandUserId: agencyClientsTable.brandUserId })
    .from(agencyClientsTable)
    .where(and(eq(agencyClientsTable.agencyId, agency.id), eq(agencyClientsTable.inviteStatus, "accepted")));
  const clientIds = acceptedClients.map(c => c.brandUserId);

  let activeCampaigns = 0;
  let totalCampaigns = 0;
  if (clientIds.length) {
    const [activeRow] = await db.select({ count: sql<number>`count(*)` }).from(campaignsTable)
      .where(sql`campaigns.brand_id = ANY(ARRAY[${sql.raw(clientIds.join(","))}]::int[]) AND campaigns.status = 'active'`);
    const [totalRow] = await db.select({ count: sql<number>`count(*)` }).from(campaignsTable)
      .where(sql`campaigns.brand_id = ANY(ARRAY[${sql.raw(clientIds.join(","))}]::int[])`);
    activeCampaigns = Number(activeRow?.count ?? 0);
    totalCampaigns = Number(totalRow?.count ?? 0);
  }

  res.json({
    agency,
    clientCount: Number(clientCountRow?.count ?? 0),
    pendingInvites: Number(pendingCountRow?.count ?? 0),
    activeCampaigns,
    totalCampaigns,
  });
});

export default router;
