import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const create = mutation({
  args: {
    rowId: v.id("rows"),
    number: v.string(),
    type: v.union(
      v.literal("standard"),
      v.literal("vip"),
      v.literal("couple"),
      v.literal("empty")
    ),
    centerType: v.optional(
      v.union(
        v.literal("first-left-row"),
        v.literal("first-right-row"),
        v.literal("first-row"),
        v.literal("middle-left-row"),
        v.literal("middle-row"),
        v.literal("middle-right-row"),
        v.literal("last-left-row"),
        v.literal("last-row"),
        v.literal("last-right-row"),
        v.literal("nomal")
      )
    ),
  },
  handler: async (ctx, args) => {
    const existingSeat = await ctx.db
      .query("seats")
      .filter((q) => q.eq(q.field("rowId"), args.rowId))
      .filter((q) => q.eq(q.field("number"), args.number))
      .collect();

    if (existingSeat.length > 0) {
      throw new Error("Một số số ghe đã tồn tại trong phòng chiếu.");
    }

    if (args.centerType === "nomal") {
      const seatId = await ctx.db.insert("seats", {
        rowId: args.rowId,
        number: args.number.trim(),
        type: args.type,
      });
      return seatId;
    }

    const seatId = await ctx.db.insert("seats", {
      rowId: args.rowId,
      number: args.number.trim(),
      type: args.type,
      centerType: args.centerType,
    });

    return seatId;
  },
});

export const get = query({
  args: {
    rowId: v.optional(v.id("rows")),
  },
  handler: async (ctx, args) => {
    if (!args.rowId) {
      return null;
    }

    const seats = await ctx.db
      .query("seats")
      .withIndex("by_rowId_and_number", (q) => q.eq("rowId", args.rowId))
      .collect();

    const sortedSeats = seats?.sort((a, b) => {
      return a._creationTime - b._creationTime;
    });

    return sortedSeats;
  },
});
