import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const JWT_SECRET = process.env.JWT_SECRET ?? "igotrend-dev-secret-2024";

export function signToken(userId: number): string {
  return jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: "30d" });
}

export function verifyToken(token: string): { sub: number } | null {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { sub: number };
    return payload;
  } catch {
    return null;
  }
}

declare global {
  namespace Express {
    interface Request {
      userId?: number;
      userRole?: string;
    }
  }
}

export async function requireAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const token = authHeader.slice(7);
  const payload = verifyToken(token);
  if (!payload) {
    res.status(401).json({ error: "Invalid token" });
    return;
  }

  const [user] = await db.select({ id: usersTable.id, role: usersTable.role, isActive: usersTable.isActive, isLocked: usersTable.isLocked })
    .from(usersTable)
    .where(eq(usersTable.id, payload.sub));

  if (!user || !user.isActive || user.isLocked) {
    res.status(401).json({ error: "Account not available" });
    return;
  }

  req.userId = user.id;
  req.userRole = user.role;
  next();
}

export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.userRole || !roles.includes(req.userRole)) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }
    next();
  };
}

export function formatUser(u: Record<string, unknown>) {
  return {
    id: u.id,
    firstName: u.firstName,
    lastName: u.lastName,
    userName: u.userName,
    email: u.email,
    phone: u.phone ?? null,
    role: u.role,
    gender: u.gender ?? null,
    badge: u.badge ?? null,
    isActive: u.isActive,
    isLocked: u.isLocked,
    countryId: u.countryId ?? null,
    stateId: u.stateId ?? null,
    companyName: u.companyName ?? null,
    companySize: u.companySize ?? null,
    companyType: u.companyType ?? null,
    instagramProfile: u.instagramProfile ?? null,
    facebookProfile: u.facebookProfile ?? null,
    twitterProfile: u.twitterProfile ?? null,
    youtubeProfile: u.youtubeProfile ?? null,
    tiktokProfile: u.tiktokProfile ?? null,
    snapchatProfile: u.snapchatProfile ?? null,
    contentCategory: u.contentCategory ?? null,
    creatorCategory: u.creatorCategory ?? null,
    gems: u.gems ?? 0,
    balance: parseFloat(String(u.balance ?? "0")),
    bio: u.bio ?? null,
    avatarUrl: u.avatarUrl ?? null,
    createdAt: u.createdAt instanceof Date ? u.createdAt.toISOString() : String(u.createdAt),
    verified: u.verified ?? false,
  };
}
