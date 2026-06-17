---
name: AI integration schema naming
description: The OpenAI skill template cp overwrites existing lib/db/src/schema/messages.ts — always use renamed files for AI tables.
---

The rule: NEVER let `cp -r .local/skills/ai-integrations-openai/templates/lib/* lib/` run unguarded if the project already has a `messages` table. The template ships `lib/db/src/schema/messages.ts` (for AI conversation messages), which will silently overwrite the existing user-to-user messages schema.

**Why:** The iGoTrend project has a `messagesTable` (from_user_id, to_user_id, body, is_read) used for the in-app messaging system. The template's `messages.ts` has (conversation_id, role, content) with a completely different shape.

**How to apply:** After running the template cp, immediately:
1. Check `git diff HEAD lib/db/src/schema/messages.ts` for overwrites.
2. Restore the original `messages.ts` from git.
3. Create `lib/db/src/schema/ai_conversations.ts` (table: `ai_conversations`) and `lib/db/src/schema/ai_messages.ts` (table: `ai_messages`) instead.
4. Update `lib/db/src/schema/index.ts` to export from `./ai_conversations` and `./ai_messages`.
5. Update any route/backend files to import from `ai_conversations`/`ai_messages`.
