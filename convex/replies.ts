import { v } from "convex/values";
import { mutation, query, QueryCtx } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { paginationOptsValidator } from "convex/server";
import { Doc, Id } from "./_generated/dataModel";
const populateReactions = (ctx: QueryCtx, replyId: Id<"replies">) => {
  return ctx.db
    .query("reactions")
    .withIndex("by_reply_id", (q) => q.eq("replyId", replyId))
    .collect();
};

export const create = mutation({
  args: {
    text: v.string(),
    image: v.optional(v.id("_storage")),
    movieId: v.id("movies"),
    messageId: v.id("messages"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error("Unauthorized");
    }

    if (!args.movieId || !args.text) {
      throw new Error("Missing required fields");
    }

    const messageId = await ctx.db.insert("replies", {
      userId: user._id,
      text: args.text,
      image: args.image,
      movieId: args.movieId,
      messageId: args.messageId,
    });

    return messageId;
  },
});

export const update = mutation({
  args: {
    id: v.id("replies"),
    text: v.string(),
    image: v.optional(v.id("_storage")),
    messageId: v.optional(v.id("messages")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error("Unauthorized");
    }
    const message = await ctx.db.get(args.id);

    if (!message) {
      throw new Error("Message not found");
    }

    if (!user || user._id !== message.userId) {
      throw new Error("Unauthorized");
    }

    if (message) {
      const updatedComment = {
        ...message,
        text: args.text,
        updatedAt: Date.now(),
      };

      if (args.image) {
        updatedComment.image = args.image;
      }

      await ctx.db.patch(args.id, updatedComment);
      return args.id;
    }
  },
});

export const remove = mutation({
  args: {
    id: v.id("replies"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const message = await ctx.db.get(args.id);

    if (!message) {
      throw new Error("Message not found");
    }

    const user = await ctx.db.get(userId);

    if (!user || user._id !== message.userId) {
      throw new Error("Unauthorized");
    }
    await ctx.db.delete(args.id);
    return args.id;
  },
});

export const get = query({
  args: {
    movieId: v.id("movies"),
    messageId: v.id("messages"),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }
    const results = await ctx.db
      .query("replies")
      .withIndex("by_movie_id_message_id", (q) =>
        q.eq("movieId", args.movieId).eq("messageId", args.messageId)
      )
      .order("desc")
      .paginate(args.paginationOpts);

    return {
      ...results,
      page: (
        await Promise.all(
          results.page.map(async (message) => {
            const user = await ctx.db.get(message.userId);
            if (!user) {
              return null;
            }

            const reactions = await populateReactions(ctx, message._id);
            const reactionsWithCounts = reactions.map((reaction) => {
              return {
                ...reaction,
                count: reactions.filter((r) => r.value === reaction.value)
                  .length,
              };
            });
            const dedupedReactions = reactionsWithCounts.reduce(
              (acc, reaction) => {
                const existingReaction = acc.find(
                  (r) => r.value === reaction.value
                );
                if (existingReaction) {
                  existingReaction.userIds = Array.from(
                    new Set([...existingReaction.userIds, reaction.userId])
                  );
                } else {
                  acc.push({ ...reaction, userIds: [reaction.userId] });
                }

                return acc;
              },
              [] as (Doc<"reactions"> & {
                count: number;
                userIds: Id<"users">[];
              })[]
            );
            const reactionsWithoutMemberIdProperty = dedupedReactions.map(
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              ({ userId, ...rest }) => rest
            );

            const image = message.image
              ? await ctx.storage.getUrl(message.image)
              : undefined;

            return {
              ...message,
              image,
              user,
              reactions: reactionsWithoutMemberIdProperty,
            };
          })
        )
      ).filter(
        (message): message is NonNullable<typeof message> => message !== null
      ),
    };
  },
});
