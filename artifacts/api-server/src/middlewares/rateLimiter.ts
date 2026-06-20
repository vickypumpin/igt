import rateLimit, { ipKeyGenerator } from "express-rate-limit";

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests from this IP. Please try again in 15 minutes." },
  keyGenerator: (req) => ipKeyGenerator(req.ip ?? "unknown"),
});

export const payoutRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many payout requests. Please try again in 1 hour." },
  keyGenerator: (req) => {
    const userId = (req as unknown as { userId?: number }).userId;
    if (userId) return `user-${userId}`;
    return ipKeyGenerator(req.ip ?? "unknown");
  },
});
