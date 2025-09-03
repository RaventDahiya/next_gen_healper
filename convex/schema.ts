import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  user: defineTable({
    name: v.string(),
    email: v.string(),
    picture: v.string(),
    credits: v.number(), // Remaining tokens
    orderId: v.optional(v.string()),
    subscriptionId: v.optional(v.string()), // Razorpay subscription ID for cancellation
    tokensUsed: v.optional(v.number()), // Total tokens used this month
    lastResetDate: v.optional(v.string()), // For monthly reset tracking
  }),
  userAiAssistants: defineTable({
    uid: v.id("user"),
    id: v.string(),
    name: v.string(),
    title: v.string(),
    image: v.string(),
    instruction: v.string(),
    userInstruction: v.string(),
    sampleQuestions: v.array(v.string()),
    aiModelId: v.optional(v.string()),
  }),
});
