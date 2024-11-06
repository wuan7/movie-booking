import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const create = mutation({
  args: {
    screeningRoomId: v.id("screeningRooms"),
    rowNumber: v.number(),
    rowName: v.string(),
  },
  handler: async (ctx, args) => {
    const existingRows = await ctx.db
      .query("rows")
      .filter((q) => q.eq(q.field("screeningRoomId"), args.screeningRoomId))
      .filter((q) => q.eq(q.field("rowNumber"), args.rowNumber))
      .filter((q) => q.eq(q.field("rowName"), args.rowName))
      .collect();

    if (existingRows.length > 0) {
      throw new Error("Một số số hàng đã tồn tại trong phòng chiếu.");
    }

    const rowIds = await ctx.db.insert("rows", {
      screeningRoomId: args.screeningRoomId,
      rowNumber: args.rowNumber,
      rowName: args.rowName.trim(),
    });

    return rowIds;
  },
});

export const get = query({
  args: {
    screeningRoomId: v.optional(v.id("screeningRooms")),
  },
  handler: async (ctx, args) => {
    if (!args.screeningRoomId) {
      return null;
    }

    const rows = await ctx.db
      .query("rows")
      .withIndex("by_screeningRoom_and_rowNumber", (q) =>
        q.eq("screeningRoomId", args.screeningRoomId)
      )
      .collect();

    return rows;
  },
});
