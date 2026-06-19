import { Router } from "express";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import { eq, and, gt } from "drizzle-orm";
import { db, usersTable, agenciesTable, settingsTable, passwordResetTokensTable, bankAccountsTable } from "@workspace/db";
import { signToken, requireAuth, formatUser } from "../lib/auth";
import { sendEmail, tplWelcome, tplPasswordReset } from "../lib/notify";
import type { IRouter } from "express";

const router: IRouter = Router();

router.post("/auth/register", async (req, res): Promise<void> => {
  const { firstName, lastName, userName, email, password, phone, role, gender, countryId, stateId, companyName, companySize, companyType } = req.body;
  if (!firstName || !lastName || !userName || !email || !password || !role) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }
  const [existing] = await db.select({ id: usersTable.id }).from(usersTable).where(eq(usersTable.email, email));
  if (existing) {
    res.status(400).json({ error: "Email already registered" });
    return;
  }
  const [existingUser] = await db.select({ id: usersTable.id }).from(usersTable).where(eq(usersTable.userName, userName));
  if (existingUser) {
    res.status(400).json({ error: "Username already taken" });
    return;
  }
  const passwordHash = await bcrypt.hash(password, 10);
  let [platformSettings] = await db.select({
    defaultBillingMode: settingsTable.defaultBillingMode,
    defaultCommissionRate: settingsTable.defaultCommissionRate,
    siteName: settingsTable.siteName,
  }).from(settingsTable).limit(1);
  const defaultBillingMode = platformSettings?.defaultBillingMode ?? "commission";
  const defaultCommissionRate = platformSettings?.defaultCommissionRate ?? "5.00";
  const siteName = platformSettings?.siteName ?? "iGoTrend";

  const normalizedRole = role === "creator" ? "creator" : role === "agency" ? "agency" : "brand";
  const [user] = await db.insert(usersTable).values({
    firstName, lastName, userName, email, passwordHash, phone: phone ?? null,
    role: normalizedRole,
    gender: gender ?? null, countryId: countryId ?? null, stateId: stateId ?? null,
    companyName: companyName ?? null, companySize: companySize ?? null, companyType: companyType ?? null,
    billingMode: normalizedRole === "brand" ? defaultBillingMode : null,
    commissionRate: normalizedRole === "brand" ? defaultCommissionRate : null,
  }).returning();
  if (user.role === "agency") {
    const agencyName = companyName ?? `${firstName} ${lastName} Agency`;
    await db.insert(agenciesTable).values({
      userId: user.id, name: agencyName, contactName: `${firstName} ${lastName}`,
      contactEmail: email, billingMode: defaultBillingMode, commissionRate: defaultCommissionRate,
    });
  }

  const dashboardUrl = process.env["APP_BASE_URL"] ?? "https://igotrend.com";
  sendEmail(email, `Welcome to ${siteName}!`, tplWelcome(siteName, firstName, dashboardUrl)).catch(console.error);

  const token = signToken(user.id);
  res.status(201).json({ token, user: formatUser(user as unknown as Record<string, unknown>) });
});

router.post("/auth/login", async (req, res): Promise<void> => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: "Missing email or password" });
    return;
  }
  const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email));
  if (!user) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }
  if (!user.isActive || user.isLocked) {
    res.status(401).json({ error: "Account is not available" });
    return;
  }
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }
  const token = signToken(user.id);
  res.json({ token, user: formatUser(user as unknown as Record<string, unknown>) });
});

router.post("/auth/logout", (_req, res): void => {
  res.json({ message: "Logged out" });
});

router.get("/auth/me", requireAuth, async (req, res): Promise<void> => {
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.userId!));
  if (!user) { res.status(404).json({ error: "User not found" }); return; }
  const [bankAccount] = await db.select().from(bankAccountsTable)
    .where(and(eq(bankAccountsTable.userId, req.userId!), eq(bankAccountsTable.isDefault, true)))
    .limit(1);
  const bankDetails = bankAccount ? {
    bankName: bankAccount.bankName,
    accountName: bankAccount.accountName,
    maskedAccountNumber: `****${bankAccount.accountNumber.slice(-4)}`,
  } : null;
  let agencyName: string | null = null;
  if (user.agencyId) {
    const [agency] = await db.select({ name: agenciesTable.name })
      .from(agenciesTable).where(eq(agenciesTable.id, user.agencyId));
    agencyName = agency?.name ?? null;
  }
  res.json({ ...formatUser(user as unknown as Record<string, unknown>), bankDetails, agencyName });
});

router.patch("/auth/me/profile", requireAuth, async (req, res): Promise<void> => {
  const { firstName, lastName, phone, gender, countryId, stateId, companyName, companySize, companyType,
    instagramProfile, facebookProfile, twitterProfile, youtubeProfile, tiktokProfile, snapchatProfile,
    dob, contentCategory, creatorCategory, bio, profilePublic } = req.body;
  const updates: Record<string, unknown> = {};
  if (firstName != null) updates.firstName = firstName;
  if (lastName != null) updates.lastName = lastName;
  if (phone != null) updates.phone = phone;
  if (gender != null) updates.gender = gender;
  if (countryId != null) updates.countryId = countryId;
  if (stateId != null) updates.stateId = stateId;
  if (companyName != null) updates.companyName = companyName;
  if (companySize != null) updates.companySize = companySize;
  if (companyType != null) updates.companyType = companyType;
  if (instagramProfile != null) updates.instagramProfile = instagramProfile;
  if (facebookProfile != null) updates.facebookProfile = facebookProfile;
  if (twitterProfile != null) updates.twitterProfile = twitterProfile;
  if (youtubeProfile != null) updates.youtubeProfile = youtubeProfile;
  if (tiktokProfile != null) updates.tiktokProfile = tiktokProfile;
  if (snapchatProfile != null) updates.snapchatProfile = snapchatProfile;
  if (dob != null) updates.dob = dob;
  if (contentCategory != null) updates.contentCategory = contentCategory;
  if (creatorCategory != null) updates.creatorCategory = creatorCategory;
  if (bio != null) updates.bio = bio;
  if (typeof profilePublic === "boolean") updates.profilePublic = profilePublic;
  updates.updatedAt = new Date();
  const [user] = await db.update(usersTable).set(updates).where(eq(usersTable.id, req.userId!)).returning();
  res.json(formatUser(user as unknown as Record<string, unknown>));
});

router.patch("/auth/me/password", requireAuth, async (req, res): Promise<void> => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) { res.status(400).json({ error: "Missing passwords" }); return; }
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.userId!));
  const valid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!valid) { res.status(400).json({ error: "Current password is incorrect" }); return; }
  const passwordHash = await bcrypt.hash(newPassword, 10);
  await db.update(usersTable).set({ passwordHash, updatedAt: new Date() }).where(eq(usersTable.id, req.userId!));
  res.json({ message: "Password updated" });
});

router.post("/auth/forgot-password", async (req, res): Promise<void> => {
  const { email } = req.body;
  if (!email) {
    res.status(400).json({ error: "Email is required" });
    return;
  }

  // Always return same message to avoid email enumeration
  const [user] = await db.select({ id: usersTable.id, firstName: usersTable.firstName, email: usersTable.email })
    .from(usersTable).where(eq(usersTable.email, email)).limit(1);

  if (user) {
    const [settings] = await db.select({ siteName: settingsTable.siteName }).from(settingsTable).limit(1);
    const siteName = settings?.siteName ?? "iGoTrend";
    const appBase = process.env["APP_BASE_URL"] ?? "https://igotrend.com";

    const rawToken = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await db.insert(passwordResetTokensTable).values({
      userId: user.id,
      token: rawToken,
      expiresAt,
    });

    const resetUrl = `${appBase}/reset-password?token=${rawToken}`;
    sendEmail(
      user.email,
      `Reset your ${siteName} password`,
      tplPasswordReset(siteName, user.firstName ?? "there", resetUrl),
    ).catch(console.error);
  }

  res.json({ message: "If that email is registered, a reset link has been sent." });
});

router.post("/auth/reset-password", async (req, res): Promise<void> => {
  const { token, password } = req.body;
  if (!token || !password) {
    res.status(400).json({ error: "token and password are required" });
    return;
  }
  if (password.length < 8) {
    res.status(400).json({ error: "Password must be at least 8 characters" });
    return;
  }

  const [resetToken] = await db.select()
    .from(passwordResetTokensTable)
    .where(
      and(
        eq(passwordResetTokensTable.token, token),
        gt(passwordResetTokensTable.expiresAt, new Date()),
      )
    )
    .limit(1);

  if (!resetToken) {
    res.status(400).json({ error: "Invalid or expired reset token" });
    return;
  }
  if (resetToken.usedAt) {
    res.status(400).json({ error: "This reset link has already been used" });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await Promise.all([
    db.update(usersTable)
      .set({ passwordHash, updatedAt: new Date() })
      .where(eq(usersTable.id, resetToken.userId)),
    db.update(passwordResetTokensTable)
      .set({ usedAt: new Date() })
      .where(eq(passwordResetTokensTable.id, resetToken.id)),
  ]);

  res.json({ message: "Password has been reset. You can now log in." });
});

router.patch("/auth/me/bank-details", requireAuth, async (req, res): Promise<void> => {
  if (req.userRole !== "creator") { res.status(403).json({ error: "Only creators can set bank details" }); return; }
  const { bankName, accountNumber, accountName } = req.body;
  if (!bankName || !accountNumber || !accountName) {
    res.status(400).json({ error: "bankName, accountNumber, and accountName are required" });
    return;
  }
  if (!/^\d{10}$/.test(accountNumber)) {
    res.status(400).json({ error: "Account number must be exactly 10 digits" });
    return;
  }
  const [existing] = await db.select({ id: bankAccountsTable.id })
    .from(bankAccountsTable)
    .where(and(eq(bankAccountsTable.userId, req.userId!), eq(bankAccountsTable.isDefault, true)))
    .limit(1);
  if (existing) {
    await db.update(bankAccountsTable)
      .set({ bankName, accountNumber, accountName })
      .where(eq(bankAccountsTable.id, existing.id));
  } else {
    await db.insert(bankAccountsTable).values({
      userId: req.userId!, bankName, accountNumber, accountName, isDefault: true,
    });
  }
  res.json({ message: "Bank details saved" });
});

router.patch("/auth/me/onboarding-complete", requireAuth, async (req, res): Promise<void> => {
  await db.update(usersTable).set({ onboardingComplete: true, updatedAt: new Date() }).where(eq(usersTable.id, req.userId!));
  res.json({ message: "Onboarding complete" });
});

router.patch("/auth/me/pricing", requireAuth, async (req, res): Promise<void> => {
  const fields = [
    "instagramDayPostPrice","instagramWeekPostPrice","instagramDayStoryPrice","instagramWeekStoryPrice",
    "instagramDayReelPrice","instagramWeekReelPrice","instagramDayLivePrice","instagramWeekLivePrice",
    "fbDayPostPrice","fbWeekPostPrice","fbDayStoryPrice","fbWeekStoryPrice","fbDayReelPrice","fbWeekReelPrice",
    "tiktokDayPostPrice","tiktokWeekPostPrice","youtubeDayPostPrice","youtubeWeekPostPrice",
    "twitterDayPostPrice","twitterWeekPostPrice","snapchatDayStoryPrice","snapchatWeekStoryPrice","contentCreatorRate",
  ];
  const updates: Record<string, unknown> = {};
  for (const f of fields) {
    if (req.body[f] != null) updates[f] = req.body[f];
  }
  updates.updatedAt = new Date();
  const [user] = await db.update(usersTable).set(updates).where(eq(usersTable.id, req.userId!)).returning();
  res.json(formatUser(user as unknown as Record<string, unknown>));
});

export default router;
