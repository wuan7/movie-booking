import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const create = mutation({
  args: {
    branchId: v.id("branches"),
    name: v.string(),
    totalSeats: v.optional(v.number()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      console.error("Failed to get user ID. User is not authenticated.");
      throw new Error("Unauthorized");
    }

    const roomId = await ctx.db.insert("screeningRooms", {
      branchId: args.branchId,
      name: args.name,
      totalSeats: args.totalSeats,
      description: args.description,
    });
    return roomId;
  },
});

export const get = query({
  args: {
    branchId: v.optional(v.id("branches")),
  },
  handler: async (ctx, args) => {
    if (!args.branchId) {
      return;
    }

    const rooms = await ctx.db
      .query("screeningRooms")
      .withIndex("by_branchId", (q) => q.eq("branchId", args.branchId))
      .collect();

    return rooms;
  },
});

export const getById = query({
  args: {
    screeningRoomId: v.optional(v.id("screeningRooms")),
  },
  handler: async (ctx, args) => {
    if (!args.screeningRoomId) {
      return;
    }
    const room = await ctx.db.get(args.screeningRoomId);
    if (!room) {
      return null;
    }
    return room;
  },
});
