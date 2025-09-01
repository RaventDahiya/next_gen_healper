import { v } from "convex/values";
import { mutation } from "./_generated/server";

// Migration utility to update assistants with problematic model IDs
export const migrateAssistantModels = mutation({
  args: {
    uid: v.id("user"),
  },
  handler: async (ctx, args) => {
    const problematicModels = [
      "google/gemini-2.0-flash-exp:free",
      "google/gemini-2.0-flash-exp",
    ];

    const newDefaultModel = "deepseek/deepseek-r1:free";

    // Find all assistants with problematic models
    const assistants = await ctx.db
      .query("userAiAssistants")
      .filter((q) => q.eq(q.field("uid"), args.uid))
      .collect();

    const updatedCount = [];

    for (const assistant of assistants) {
      if (
        assistant.aiModelId &&
        problematicModels.includes(assistant.aiModelId)
      ) {
        await ctx.db.patch(assistant._id, {
          aiModelId: newDefaultModel,
        });
        updatedCount.push(assistant._id);
      }
    }

    return {
      message: `Updated ${updatedCount.length} assistants to use DeepSeek R1`,
      updatedAssistants: updatedCount,
    };
  },
});
