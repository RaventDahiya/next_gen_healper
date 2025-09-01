import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const InsertSelectedAssistants = mutation({
  args: {
    records: v.any(),
    uid: v.id("user"),
  },
  handler: async (ctx, args) => {
    const insertedIds = [];
    // Default to DeepSeek R1 as it's more reliable
    const defaultModelValue = "deepseek/deepseek-r1:free";
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

export const GetAssistantById = query({
  args: {
    assistantId: v.id("userAiAssistants"),
  },
  handler: async (ctx, args) => {
    const assistant = await ctx.db.get(args.assistantId);
    return assistant;
  },
});

export const GetAssistantByCustomId = query({
  args: {
    customId: v.string(),
    uid: v.id("user"),
  },
  handler: async (ctx, args) => {
    const assistant = await ctx.db
      .query("userAiAssistants")
      .filter((q) =>
        q.and(
          q.eq(q.field("uid"), args.uid),
          q.eq(q.field("id"), args.customId)
        )
      )
      .first();
    return assistant;
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

export const CreateUserAssistant = mutation({
  args: {
    uid: v.id("user"),
    name: v.string(),
    title: v.string(),
    instruction: v.string(),
    image: v.optional(v.string()),
    sampleQuestions: v.optional(v.array(v.string())),
    aiModelId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Generate a truly unique id for the custom assistant
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const customId = `custom_${timestamp}_${random}`;
    const defaultModelValue = args.aiModelId || "deepseek/deepseek-r1:free";

    const insertedId = await ctx.db.insert("userAiAssistants", {
      id: customId,
      name: args.name,
      title: args.title,
      instruction: args.instruction,
      userInstruction: args.instruction,
      image: args.image || "/logo.svg",
      sampleQuestions: args.sampleQuestions || [],
      aiModelId: defaultModelValue,
      uid: args.uid,
    });

    return insertedId;
  },
});
