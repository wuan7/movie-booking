import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const toggle = mutation({
  args: {
    messageId: v.id("messages"),
    value: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const message = await ctx.db.get(args.messageId);

    if (!message) {
      throw new Error("Message not found");
    }

    const user = await ctx.db.get(userId);

    if (!user) {
      throw new Error("Unauthorized");
    }

    const exsitingMessageReactionFromUser = await ctx.db
      .query("reactions")
      .filter((q) =>
        q.and(
          q.eq(q.field("messageId"), args.messageId),
          q.eq(q.field("userId"), user._id),
          q.eq(q.field("value"), args.value)
        )
      )
      .first();
    if (exsitingMessageReactionFromUser) {
      await ctx.db.delete(exsitingMessageReactionFromUser._id);
      return exsitingMessageReactionFromUser._id;
    } else {
      const newReactionId = await ctx.db.insert("reactions", {
        value: args.value,
        userId: user._id,
        messageId: args.messageId,
        movieId: message.movieId,
      });
      return newReactionId;
    }
  },
});
export const toggleReply = mutation({
  args: {
    replyId: v.id("replies"),
    value: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const reply = await ctx.db.get(args.replyId);
    if (!reply) {
      throw new Error("Message not found");
    }

    const user = await ctx.db.get(userId);

    if (!user) {
      throw new Error("Unauthorized");
    }

    const exsitingMessageReactionFromUser = await ctx.db
      .query("reactions")
      .filter((q) =>
        q.and(
          q.eq(q.field("replyId"), args.replyId),
          q.eq(q.field("userId"), user._id),
          q.eq(q.field("value"), args.value)
        )
      )
      .first();
    if (exsitingMessageReactionFromUser) {
      await ctx.db.delete(exsitingMessageReactionFromUser._id);
      return exsitingMessageReactionFromUser._id;
    } else {
      const newReactionId = await ctx.db.insert("reactions", {
        value: args.value,
        userId: user._id,
        replyId: args.replyId,
        movieId: reply.movieId,
      });
      return newReactionId;
    }
  },
});
