import { Router } from "express";
import { eq, and, asc } from "drizzle-orm";
import { db, aiConversations, aiMessages } from "@workspace/db";
import { requireAuth } from "../lib/auth";
import { openai } from "@workspace/integrations-openai-ai-server";
import type { IRouter } from "express";

const router: IRouter = Router();

const SYSTEM_PROMPT = `You are Trend AI, the built-in marketing intelligence assistant for iGoTrend — a B2B influencer marketing platform purpose-built for West Africa.

Your expertise covers:
- Influencer marketing strategy across Nigeria, Ghana, Kenya, Côte d'Ivoire, Senegal, and broader West Africa
- Creator tiers: nano (1K-10K), micro (10K-50K), macro (50K-500K), mega (500K+), and elite (1M+) — explaining trade-offs for each
- Campaign planning: objectives, budgets in NGN/GHS/KES/XOF, timelines, KPIs, and content briefs
- Social media platforms popular in the region: TikTok, Instagram, YouTube, Twitter/X, Snapchat, and local platforms
- Brand safety, influencer vetting, audience authenticity, and fraud detection
- Pricing benchmarks and negotiations in West African markets
- Content formats: short-form video, UGC, live commerce, storytelling, and product integrations
- Industry verticals: fintech, FMCG, fashion, beauty, telco, food & beverage, entertainment, and e-commerce
- Cultural nuances across Yoruba, Igbo, Hausa, Akan, and other major West African communities
- ROI measurement, attribution, and reporting for influencer campaigns

Tone: professional, confident, practical. Give concrete, actionable advice. Use local context when relevant (e.g., mention Paystack, OPay, or local celebrities where appropriate). Always prioritize accuracy over completeness — say "I'm not sure" if needed rather than guessing.

When the user asks about iGoTrend platform features, explain how brands, creators, and agencies can use iGoTrend to manage campaigns, track submissions, handle payouts, and measure ROI.`;

router.get("/openai/conversations", requireAuth, async (req, res): Promise<void> => {
  const userId = req.userId!;
  try {
    const convos = await db
      .select()
      .from(aiConversations)
      .where(eq(aiConversations.userId, userId))
      .orderBy(asc(aiConversations.createdAt));
    res.json(convos);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch conversations" });
  }
});

router.post("/openai/conversations", requireAuth, async (req, res): Promise<void> => {
  const userId = req.userId!;
  const { title } = req.body;
  if (!title) {
    res.status(400).json({ error: "title is required" });
    return;
  }
  try {
    const [convo] = await db
      .insert(aiConversations)
      .values({ userId, title })
      .returning();
    res.status(201).json(convo);
  } catch (err) {
    res.status(500).json({ error: "Failed to create conversation" });
  }
});

router.get("/openai/conversations/:id", requireAuth, async (req, res): Promise<void> => {
  const userId = req.userId!;
  const id = parseInt(req.params.id, 10);
  try {
    const [convo] = await db
      .select()
      .from(aiConversations)
      .where(and(eq(aiConversations.id, id), eq(aiConversations.userId, userId)));
    if (!convo) {
      res.status(404).json({ error: "Conversation not found" });
      return;
    }
    const msgs = await db
      .select()
      .from(aiMessages)
      .where(eq(aiMessages.conversationId, id))
      .orderBy(asc(aiMessages.createdAt));
    res.json({ ...convo, messages: msgs });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch conversation" });
  }
});

router.delete("/openai/conversations/:id", requireAuth, async (req, res): Promise<void> => {
  const userId = req.userId!;
  const id = parseInt(req.params.id, 10);
  try {
    const [convo] = await db
      .select()
      .from(aiConversations)
      .where(and(eq(aiConversations.id, id), eq(aiConversations.userId, userId)));
    if (!convo) {
      res.status(404).json({ error: "Conversation not found" });
      return;
    }
    await db.delete(aiConversations).where(eq(aiConversations.id, id));
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: "Failed to delete conversation" });
  }
});

router.get("/openai/conversations/:id/messages", requireAuth, async (req, res): Promise<void> => {
  const userId = req.userId!;
  const id = parseInt(req.params.id, 10);
  try {
    const [convo] = await db
      .select()
      .from(aiConversations)
      .where(and(eq(aiConversations.id, id), eq(aiConversations.userId, userId)));
    if (!convo) {
      res.status(404).json({ error: "Conversation not found" });
      return;
    }
    const msgs = await db
      .select()
      .from(aiMessages)
      .where(eq(aiMessages.conversationId, id))
      .orderBy(asc(aiMessages.createdAt));
    res.json(msgs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

router.post("/openai/conversations/:id/messages", requireAuth, async (req, res): Promise<void> => {
  const userId = req.userId!;
  const id = parseInt(req.params.id, 10);
  const { content } = req.body;

  if (!content?.trim()) {
    res.status(400).json({ error: "content is required" });
    return;
  }

  try {
    const [convo] = await db
      .select()
      .from(aiConversations)
      .where(and(eq(aiConversations.id, id), eq(aiConversations.userId, userId)));
    if (!convo) {
      res.status(404).json({ error: "Conversation not found" });
      return;
    }

    await db.insert(aiMessages).values({ conversationId: id, role: "user", content: content.trim() });

    const history = await db
      .select()
      .from(aiMessages)
      .where(eq(aiMessages.conversationId, id))
      .orderBy(asc(aiMessages.createdAt));

    const chatMessages = [
      { role: "system" as const, content: SYSTEM_PROMPT },
      ...history.map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
    ];

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");

    let fullResponse = "";
    const stream = await openai.chat.completions.create({
      model: "gpt-5.4",
      max_completion_tokens: 8192,
      messages: chatMessages,
      stream: true,
    });

    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content;
      if (delta) {
        fullResponse += delta;
        res.write(`data: ${JSON.stringify({ content: delta })}\n\n`);
      }
    }

    await db.insert(aiMessages).values({ conversationId: id, role: "assistant", content: fullResponse });

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (err) {
    console.error("AI chat error:", err);
    if (!res.headersSent) {
      res.status(500).json({ error: "AI request failed" });
    } else {
      res.write(`data: ${JSON.stringify({ error: "Stream error" })}\n\n`);
      res.end();
    }
  }
});

export default router;
