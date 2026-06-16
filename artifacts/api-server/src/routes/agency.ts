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

router.delete("/agency/clients/:id", requireAuth, requireRole("agency"), async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  await db.delete(agencyClientsTable).where(eq(agencyClientsTable.id, id));
  res.json({ message: "Removed" });
});

router.get("/agency/campaigns", requireAuth, requireRole("agency"), async (req, res): Promise<void> => {
  const [agency] = await db.select().from(agenciesTable).where(eq(agenciesTable.userId, req.userId!));
  if (!agency) { res.status(404).json({ error: "Agency not found" }); return; }
  const clients = await db.select({ brandUserId: agencyClientsTable.brandUserId })
    .from(agencyClientsTable)
    .where(and(eq(agencyClientsTable.agencyId, agency.id), eq(agencyClientsTable.inviteStatus, "accepted")));
  const clientIds = clients.map(c => c.brandUserId);
  if (!clientIds.length) { res.json([]); return; }
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
  res.json(campaigns);
});

router.get("/agency/dashboard", requireAuth, requireRole("agency"), async (req, res): Promise<void> => {
  const [agency] = await db.select().from(agenciesTable).where(eq(agenciesTable.userId, req.userId!));
  if (!agency) { res.status(404).json({ error: "Agency not found" }); return; }
  const [clientCountRow] = await db.select({ count: sql<number>`count(*)` }).from(agencyClientsTable)
    .where(and(eq(agencyClientsTable.agencyId, agency.id), eq(agencyClientsTable.inviteStatus, "accepted")));
  const [pendingCountRow] = await db.select({ count: sql<number>`count(*)` }).from(agencyClientsTable)
    .where(and(eq(agencyClientsTable.agencyId, agency.id), eq(agencyClientsTable.inviteStatus, "pending")));
  res.json({
    agency,
    clientCount: Number(clientCountRow?.count ?? 0),
    pendingInvites: Number(pendingCountRow?.count ?? 0),
  });
});

export default router;
