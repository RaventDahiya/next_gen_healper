import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const InsertSelectedAssistants = mutation({
  args: {
    records: v.any(),
    uid: v.id("user"),
  },
  handler: async (ctx, args) => {
    const insertedIds = [];
    // Default to OpenRouter value for Gemini 2.0 Flash
    const defaultModelValue = "google/gemini-2.0-flash-exp:free";
    for (const record of args.records) {
      // Check if assistant with same id and uid already exists
      const existing = await ctx.db
        .query("userAiAssistants")
        .filter((q) =>
          q.and(
            q.eq(q.field("uid"), args.uid),
            q.eq(q.field("id"), record.id.toString())
          )
        )
        .collect();
      if (existing.length === 0) {
        const insertedId = await ctx.db.insert("userAiAssistants", {
          ...record,
          aiModelId: defaultModelValue,
          uid: args.uid,
        });
        insertedIds.push(insertedId);
      }
    }
    return insertedIds;
  },
});

export const GetAllUserAssistants = query({
  args: {
    uid: v.id("user"),
  },
  handler: async (ctx, args) => {
    const result = await ctx.db
      .query("userAiAssistants")
      .filter((q) => q.eq(q.field("uid"), args.uid))
      .collect();
    return result;
  },
});

export const updateUserAssistant = mutation({
  args: {
    id: v.id("userAiAssistants"),
    userInstruction: v.string(),
    aiModelId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const result = await ctx.db.patch(args.id, {
      userInstruction: args.userInstruction,
      ...(args.aiModelId !== undefined && { aiModelId: args.aiModelId }),
    });
    return result;
  },
});

export const deleteUserAssistant = mutation({
  args: {
    id: v.id("userAiAssistants"),
  },
  handler: async (ctx, args) => {
    const result = await ctx.db.delete(args.id);
  },
});
