import { v } from "convex/values";
import { mutation } from "./_generated/server";

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
      await ctx.db.insert("user", {
        name: args.name,
        email: args.email,
        picture: args.picture,
        credits: 5000,
      });
    } else {
      return user[0];
    }
  },
});
