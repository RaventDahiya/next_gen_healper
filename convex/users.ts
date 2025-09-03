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
    tokensUsed: v.optional(v.number()),
    orderId: v.optional(v.string()),
    subscriptionId: v.optional(v.string()),
    creditsToAdd: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error("User not found");
    }

    let newCredits = user.credits;
    let totalTokensUsed = user.tokensUsed || 0;

    // If orderId is provided, this is a payment/upgrade scenario
    if (args.orderId) {
      // Pro plan gets 500,000 tokens
      const proCredits = args.creditsToAdd || 500000;
      newCredits = proCredits;
      totalTokensUsed = 0; // Reset tokens used on upgrade

      const updateData: any = {
        credits: newCredits,
        tokensUsed: totalTokensUsed,
        orderId: args.orderId,
        lastResetDate: new Date().toISOString(),
      };

      // Add subscriptionId if provided
      if (args.subscriptionId) {
        updateData.subscriptionId = args.subscriptionId;
      }

      await ctx.db.patch(args.userId, updateData);

      return {
        remainingCredits: newCredits,
        totalTokensUsed: totalTokensUsed,
        message: "Credits upgraded successfully",
        isPro: true,
      };
    }
    // If tokensUsed is provided, this is consuming credits
    else if (args.tokensUsed) {
      newCredits = Math.max(0, user.credits - args.tokensUsed);
      totalTokensUsed = totalTokensUsed + args.tokensUsed;

      await ctx.db.patch(args.userId, {
        credits: newCredits,
        tokensUsed: totalTokensUsed,
      });

      return {
        remainingCredits: newCredits,
        totalTokensUsed: totalTokensUsed,
        message: "Credits consumed",
        isPro: !!user.orderId,
      };
    }
    // If creditsToAdd is provided without orderId, add credits to existing balance
    else if (args.creditsToAdd) {
      newCredits = user.credits + args.creditsToAdd;

      await ctx.db.patch(args.userId, {
        credits: newCredits,
      });

      return {
        remainingCredits: newCredits,
        totalTokensUsed: totalTokensUsed,
        message: `Added ${args.creditsToAdd} credits`,
        isPro: !!user.orderId,
      };
    }

    // If no valid operation provided
    throw new Error("No valid operation specified");
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

// Handle successful payment upgrade
export const UpgradeUserToPro = mutation({
  args: {
    userId: v.id("user"),
    orderId: v.string(),
    paymentId: v.string(),
    subscriptionId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Pro plan: 500,000 tokens
    const proCredits = 500000;

    await ctx.db.patch(args.userId, {
      credits: proCredits,
      tokensUsed: 0, // Reset usage on upgrade
      orderId: args.orderId,
      subscriptionId: args.subscriptionId, // Save subscription ID for cancellation
      lastResetDate: new Date().toISOString(),
    });

    return {
      success: true,
      credits: proCredits,
      orderId: args.orderId,
      subscriptionId: args.subscriptionId,
      message: "Successfully upgraded to Pro plan",
    };
  },
});

// Cancel user subscription and downgrade to free plan
export const CancelUserSubscription = mutation({
  args: {
    userId: v.id("user"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error("User not found");
    }

    if (!user.subscriptionId && !user.orderId) {
      throw new Error("No active subscription found");
    }

    // Downgrade to free plan: 10,000 tokens
    const freeCredits = 10000;

    await ctx.db.patch(args.userId, {
      credits: freeCredits,
      tokensUsed: 0, // Reset usage on downgrade
      orderId: undefined, // Remove order ID
      subscriptionId: undefined, // Remove subscription ID
      lastResetDate: new Date().toISOString(),
    });

    return {
      success: true,
      credits: freeCredits,
      message: "Subscription cancelled successfully. Downgraded to free plan.",
    };
  },
});
