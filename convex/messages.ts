import { v } from "convex/values";
import { mutation, query, QueryCtx } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

import { paginationOptsValidator } from "convex/server";
import { Doc, Id } from "./_generated/dataModel";

const populateReactions = (ctx: QueryCtx, messageId: Id<"messages">) => {
  return ctx.db
    .query("reactions")
    .withIndex("by_message_id", (q) => q.eq("messageId", messageId))
    .collect();
};

const populateThread = async (ctx: QueryCtx, messageId: Id<"messages">) => {
  const messages = await ctx.db
    .query("replies")
    .withIndex("by_message_id", (q) => q.eq("messageId", messageId))
    .collect();
  if (messages.length === 0) {
    return {
      count: 0,
      image: undefined,
      timestamp: 0,
      name: "",
    };
  }
  const lastMessage = messages[messages.length - 1];

  const lastMessageUser = await populateUser(ctx, lastMessage.userId);

  return {
    count: messages.length,
    image: lastMessageUser?.image,
    timestamp: lastMessage._creationTime,
    name: lastMessageUser?.name,
  };
};

const populateUser = (ctx: QueryCtx, userId: Id<"users">) => {
  return ctx.db.get(userId);
};

export const create = mutation({
  args: {
    text: v.string(),
    image: v.optional(v.id("_storage")),
    movieId: v.id("movies"),
    parentMessageId: v.optional(v.id("messages")),
    rating: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
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

    const existingBookings = await ctx.db
      .query("bookings")
      .filter((q) =>
        q.and(
          q.eq(q.field("userId"), user._id),
          q.eq(q.field("movieId"), args.movieId)
        )
      )
      .collect(); // Sử dụng collect để lấy tất cả các booking

    // Kiểm tra xem có bất kỳ booking nào với trạng thái "paid"
    const isBooked = existingBookings.some(
      (booking) => booking.status === "paid"
    );
    if (!isBooked) {
      throw new Error("You must book a movie before commenting");
    }

    // Kiểm tra rating có hợp lệ không
    const rating = Number(args.rating);
    if (rating < 1 || rating > 10) {
      throw new Error("Rating must be between 1 and 10");
    }

    // Kiểm tra xem người dùng đã bình luận về phim này chưa
    const existingComment = await ctx.db
      .query("messages")
      .filter((q) =>
        q.and(
          q.eq(q.field("userId"), user._id),
          q.eq(q.field("movieId"), args.movieId)
        )
      )
      .first();

    if (existingComment) {
      await ctx.db.replace(existingComment._id, {
        ...existingComment,
        text: args.text,
        image: args.image,
        rating: rating,
        updatedAt: Date.now(),
        userId: user._id,
        movieId: args.movieId,
        tags: args.tags,
      });
      return existingComment._id;
    } else {
      const messageId = await ctx.db.insert("messages", {
        userId: user._id,
        text: args.text,
        image: args.image,
        movieId: args.movieId,
        parentMessageId: args.parentMessageId,
        rating: rating,
        tags: args.tags,
      });

      if (!args.parentMessageId) {
        await ctx.db.replace(messageId, {
          parentMessageId: messageId,
          userId: user._id,
          text: args.text,
          image: args.image,
          movieId: args.movieId,
          rating: rating,
          tags: args.tags,
        });
      }
      return messageId;
    }
  },
});

export const update = mutation({
  args: {
    id: v.id("messages"),
    text: v.string(),
    image: v.optional(v.id("_storage")),
    parentMessageId: v.optional(v.id("messages")),
    rating: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
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

    // Kiểm tra rating có hợp lệ không
    if (args.rating) {
      const rating = Number(args.rating);
      if (rating < 1 || rating > 10) {
        throw new Error("Rating must be between 1 and 10");
      }
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
      if (args.rating) {
        updatedComment.rating = Number(args.rating);
      }
      if (args.tags) {
        updatedComment.tags = args.tags;
      }

      await ctx.db.patch(args.id, updatedComment);
      return args.id;
    }
  },
});

export const get = query({
  args: {
    movieId: v.id("movies"),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }
    const results = await ctx.db
      .query("messages")
      .withIndex("by_movie_id", (q) => q.eq("movieId", args.movieId))
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
            const thread = await populateThread(ctx, message._id);
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
              threadCount: thread.count,
              threadImage: thread.image,
              threadName: thread.name,
              threadTimestamp: thread.timestamp,
            };
          })
        )
      ).filter(
        (message): message is NonNullable<typeof message> => message !== null
      ),
    };
  },
});

export const getMovieRating = query({
  args: {
    movieId: v.id("movies"),
  },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_movie_id", (q) => q.eq("movieId", args.movieId))
      .collect();

    const totalScore = messages.reduce(
      (sum, message) => sum + message.rating,
      0
    );
    const totalRatings = messages.length;
    const averageRating = totalRatings > 0 ? totalScore / totalRatings : 0;

    return {
      averageRating: parseFloat(averageRating.toFixed(2)),
      totalRatings,
    };
  },
});

export const getById = query({
  args: {
    id: v.id("messages"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    if (!args.userId) {
      throw new Error("Unauthorized");
    }

    const message = await ctx.db.get(args.id);

    if (!message) {
      return null;
    }

    const user = await ctx.db.get(args.userId);

    if (!user) {
      return null;
    }

    const reactions = await populateReactions(ctx, message._id);

    const reactionsWithCounts = reactions.map((reaction) => {
      return {
        ...reaction,
        count: reactions.filter((r) => r.value === reaction.value).length,
      };
    });

    const dedupedReactions = reactionsWithCounts.reduce(
      (acc, reaction) => {
        const existingReaction = acc.find((r) => r.value === reaction.value);
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
    return {
      ...message,
      image: message.image
        ? await ctx.storage.getUrl(message.image)
        : undefined,
      user,
      reactions: reactionsWithoutMemberIdProperty,
    };
  },
});

export const remove = mutation({
  args: {
    id: v.id("messages"),
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
    const existingReplies = ctx.db
      .query("replies")
      .withIndex("by_message_id", (q) => q.eq("messageId", args.id))
      .collect();
    if ((await existingReplies).length > 0) {
      for (const reply of await existingReplies) {
        await ctx.db.delete(reply._id);
      }
    }

    return args.id;
  },
});
