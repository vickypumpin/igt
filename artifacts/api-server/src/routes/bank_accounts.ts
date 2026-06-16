import { Router } from "express";
import { eq, and } from "drizzle-orm";
import { db, bankAccountsTable } from "@workspace/db";
import { requireAuth } from "../lib/auth";
import type { IRouter } from "express";

const router: IRouter = Router();

router.get("/bank-accounts", requireAuth, async (req, res): Promise<void> => {
  const accounts = await db.select().from(bankAccountsTable).where(eq(bankAccountsTable.userId, req.userId!));
  res.json(accounts.map(a => ({
    id: a.id, userId: a.userId, bankName: a.bankName, bankCode: a.bankCode ?? null,
    accountNumber: a.accountNumber, accountName: a.accountName, isDefault: a.isDefault,
    createdAt: a.createdAt instanceof Date ? a.createdAt.toISOString() : String(a.createdAt),
  })));
});

router.post("/bank-accounts", requireAuth, async (req, res): Promise<void> => {
  const { bankName, bankCode, accountNumber, accountName, isDefault } = req.body;
  if (!bankName || !accountNumber || !accountName) {
    res.status(400).json({ error: "bankName, accountNumber, and accountName are required" });
    return;
  }
  if (isDefault) {
    await db.update(bankAccountsTable).set({ isDefault: false }).where(eq(bankAccountsTable.userId, req.userId!));
  }
  const [account] = await db.insert(bankAccountsTable).values({
    userId: req.userId!, bankName, bankCode: bankCode ?? null,
    accountNumber, accountName, isDefault: isDefault ?? false,
  }).returning();
  res.status(201).json({
    id: account.id, userId: account.userId, bankName: account.bankName, bankCode: account.bankCode ?? null,
    accountNumber: account.accountNumber, accountName: account.accountName, isDefault: account.isDefault,
    createdAt: account.createdAt instanceof Date ? account.createdAt.toISOString() : String(account.createdAt),
  });
});

router.patch("/bank-accounts/:id/set-default", requireAuth, async (req, res): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  const [account] = await db.select().from(bankAccountsTable).where(
    and(eq(bankAccountsTable.id, id), eq(bankAccountsTable.userId, req.userId!))
  );
  if (!account) { res.status(404).json({ error: "Not found" }); return; }
  await db.update(bankAccountsTable).set({ isDefault: false }).where(eq(bankAccountsTable.userId, req.userId!));
  await db.update(bankAccountsTable).set({ isDefault: true }).where(eq(bankAccountsTable.id, id));
  res.json({ message: "Updated" });
});

router.delete("/bank-accounts/:id", requireAuth, async (req, res): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  await db.delete(bankAccountsTable).where(
    and(eq(bankAccountsTable.id, id), eq(bankAccountsTable.userId, req.userId!))
  );
  res.json({ message: "Deleted" });
});

export default router;
