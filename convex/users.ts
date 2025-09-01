import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const CreateUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    picture: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("user")
      .filter((q) => q.eq(q.field("email"), args.email))
      .collect();

    if (user.length === 0) {
      const userId = await ctx.db.insert("user", {
        name: args.name,
        email: args.email,
        picture: args.picture,
        credits: 10000, // Free plan starts with 10,000 tokens
        tokensUsed: 0,
        lastResetDate: new Date().toISOString(),
      });
      // Return the newly created user with its _id
      const newUser = await ctx.db.get(userId);
      return newUser;
    } else {
      return user[0];
    }
  },
});

export const GetUser = query({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("user")
      .filter((q) => q.eq(q.field("email"), args.email))
      .collect();
    return user[0];
  },
});

export const UpdateUserCredits = mutation({
  args: {
    userId: v.id("user"),
    tokensUsed: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error("User not found");
    }

    const newCredits = Math.max(0, user.credits - args.tokensUsed);
    const totalTokensUsed = (user.tokensUsed || 0) + args.tokensUsed;

    await ctx.db.patch(args.userId, {
      credits: newCredits,
      tokensUsed: totalTokensUsed,
    });

    return {
      remainingCredits: newCredits,
      totalTokensUsed: totalTokensUsed,
    };
  },
});

export const GetUserById = query({
  args: {
    userId: v.id("user"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.userId);
  },
});

// Utility function for testing - set user credits to a specific amount
export const SetUserCredits = mutation({
  args: {
    userId: v.id("user"),
    credits: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error("User not found");
    }

    await ctx.db.patch(args.userId, {
      credits: args.credits,
      tokensUsed: 0, // Reset tokens used when manually setting credits
    });

    return {
      credits: args.credits,
      message: `Credits set to ${args.credits}`,
    };
  },
});
