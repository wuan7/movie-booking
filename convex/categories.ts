import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const create = mutation({
    args: {
      name: v.string(),
      
    },
    handler: async (ctx, args) => {
      const categoryId = await ctx.db.insert("categories", {
        name: args.name,
      });
      return categoryId;
    },
  });

  export const get = query({
    args: {},
    handler: async (ctx) => {
      const categories = await ctx.db.query("categories").collect();
      return categories;
    },
  });

  export const getById = query({
    args: {
      id: v.id("categories"),
    },
    handler: async (ctx, args) => {
        const category = await ctx.db.get(args.id);
        return category;
    },
  });