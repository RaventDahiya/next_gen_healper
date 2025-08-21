import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const InsertSelectedAssistants = mutation({
  args: {
    records: v.any(),
    uid: v.id("user"),
  },
  handler: async (ctx, args) => {
    const insertedIds = await Promise.all(
      args.records.map(async (record: any) => {
        return await ctx.db.insert("userAiAssistants", {
          ...record,
          aiModelId: "Google: Gemini 2.0 Flash",
          uid: args.uid,
        });
      })
    );
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
    aiModelId: v.string(),
  },
  handler: async (ctx, args) => {
    const result = await ctx.db.patch(args.id, {
      userInstruction: args.userInstruction,
      aiModelId: args.aiModelId,
    });
    return result;
  },
});
