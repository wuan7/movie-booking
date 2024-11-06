import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    posterUrl: v.optional(v.id("_storage")),
    link: v.optional(v.string()),
    isPublished: v.boolean(),
    publishedAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const bannerId = await ctx.db.insert("banners", {
      title: args.title,
      description: args.description,
      posterUrl: args.posterUrl,
      link: args.link,
      isPublished: args.isPublished,
      publishedAt: args.publishedAt,
    });
    return bannerId;
  },
});
export const get = query({
  args: {},
  handler: async (ctx) => {
    const banners = await ctx.db
      .query("banners")
      .filter((q) => q.eq(q.field("isPublished"), true))
      .collect();
    const bannersWithPosterUrls = await Promise.all(
      banners.map(async (banner) => {
        if (banner.posterUrl) {
          const posterUrlString = banner.posterUrl
            ? await ctx.storage.getUrl(banner.posterUrl)
            : undefined;
          return {
            ...banner,
            posterUrl: posterUrlString,
          };
        }
        return banner;
      })
    );
    return bannersWithPosterUrls;
  },
});
