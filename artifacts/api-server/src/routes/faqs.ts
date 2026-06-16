import { Router } from "express";
import { eq, asc } from "drizzle-orm";
import { db, faqsTable } from "@workspace/db";
import { requireAuth, requireRole } from "../lib/auth";
import type { IRouter } from "express";

const router: IRouter = Router();

const faqShape = (f: typeof faqsTable.$inferSelect) => ({
  id: f.id, question: f.question, answer: f.answer, category: f.category,
  isActive: f.isActive, sortOrder: f.sortOrder,
  createdAt: f.createdAt instanceof Date ? f.createdAt.toISOString() : String(f.createdAt),
  updatedAt: f.updatedAt instanceof Date ? f.updatedAt.toISOString() : String(f.updatedAt),
});

router.get("/faqs", async (_req, res): Promise<void> => {
  const faqs = await db.select().from(faqsTable).where(eq(faqsTable.isActive, true)).orderBy(asc(faqsTable.sortOrder), asc(faqsTable.createdAt));
  res.json(faqs.map(faqShape));
});

router.get("/admin/faqs", requireAuth, requireRole("admin"), async (_req, res): Promise<void> => {
  const faqs = await db.select().from(faqsTable).orderBy(asc(faqsTable.sortOrder), asc(faqsTable.createdAt));
  res.json(faqs.map(faqShape));
});

router.post("/admin/faqs", requireAuth, requireRole("admin"), async (req, res): Promise<void> => {
  const { question, answer, category, sortOrder } = req.body;
  if (!question || !answer) { res.status(400).json({ error: "question and answer required" }); return; }
  const [faq] = await db.insert(faqsTable).values({
    question, answer, category: category ?? "general", sortOrder: sortOrder ?? 0,
  }).returning();
  res.status(201).json(faqShape(faq));
});

router.patch("/admin/faqs/:id", requireAuth, requireRole("admin"), async (req, res): Promise<void> => {
  const id = parseInt(String(req.params.id), 10);
  const { question, answer, category, isActive, sortOrder } = req.body;
  const updates: Record<string, unknown> = { updatedAt: new Date() };
  if (question != null) updates.question = question;
  if (answer != null) updates.answer = answer;
  if (category != null) updates.category = category;
  if (isActive != null) updates.isActive = isActive;
  if (sortOrder != null) updates.sortOrder = sortOrder;
  const [faq] = await db.update(faqsTable).set(updates).where(eq(faqsTable.id, id)).returning();
  if (!faq) { res.status(404).json({ error: "Not found" }); return; }
  res.json(faqShape(faq));
});

router.delete("/admin/faqs/:id", requireAuth, requireRole("admin"), async (req, res): Promise<void> => {
  const id = parseInt(String(req.params.id), 10);
  await db.delete(faqsTable).where(eq(faqsTable.id, id));
  res.json({ message: "Deleted" });
});

export default router;
