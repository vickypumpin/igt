import { Router } from "express";
import { eq } from "drizzle-orm";
import { db, legalPagesTable } from "@workspace/db";
import { requireAuth, requireRole } from "../lib/auth";
import type { IRouter } from "express";

const router: IRouter = Router();

const pageShape = (p: typeof legalPagesTable.$inferSelect) => ({
  id: p.id, slug: p.slug, title: p.title, content: p.content,
  updatedAt: p.updatedAt instanceof Date ? p.updatedAt.toISOString() : String(p.updatedAt),
});

router.get("/legal/:slug", async (req, res): Promise<void> => {
  const [page] = await db.select().from(legalPagesTable).where(eq(legalPagesTable.slug, req.params.slug));
  if (!page) { res.status(404).json({ error: "Page not found" }); return; }
  res.json(pageShape(page));
});

router.get("/admin/legal", requireAuth, requireRole("admin"), async (_req, res): Promise<void> => {
  const pages = await db.select().from(legalPagesTable);
  res.json(pages.map(pageShape));
});

// POST collection — create a new legal page by slug
router.post("/admin/legal", requireAuth, requireRole("admin"), async (req, res): Promise<void> => {
  const { slug, title, content } = req.body;
  if (!slug || !title || content == null) { res.status(400).json({ error: "slug, title and content required" }); return; }
  const [existing] = await db.select({ id: legalPagesTable.id }).from(legalPagesTable).where(eq(legalPagesTable.slug, slug));
  if (existing) { res.status(409).json({ error: "Page with this slug already exists. Use PUT /admin/legal/:slug to update." }); return; }
  const [page] = await db.insert(legalPagesTable).values({ slug, title, content }).returning();
  res.status(201).json(pageShape(page!));
});

router.put("/admin/legal/:slug", requireAuth, requireRole("admin"), async (req, res): Promise<void> => {
  const { slug } = req.params;
  const { title, content } = req.body;
  if (!title || content == null) { res.status(400).json({ error: "title and content required" }); return; }
  const [existing] = await db.select({ id: legalPagesTable.id }).from(legalPagesTable).where(eq(legalPagesTable.slug, slug));
  let page;
  if (existing) {
    [page] = await db.update(legalPagesTable).set({ title, content, updatedAt: new Date() }).where(eq(legalPagesTable.slug, slug)).returning();
  } else {
    [page] = await db.insert(legalPagesTable).values({ slug, title, content }).returning();
  }
  res.json(pageShape(page!));
});

export default router;
