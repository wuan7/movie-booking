import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { paginationOptsValidator } from "convex/server";

export const create = mutation({
  args: {
    title: v.string(),
    slug: v.string(),
    content: v.string(),
    author: v.optional(v.string()),
    readTime: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
    categoryId: v.id("categories"),
    metaTitle: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
    posterUrl: v.optional(v.id("_storage")),
    isPublished: v.boolean(),
  },
  handler: async (ctx, args) => {

    const blogId = await ctx.db.insert("blogs", {
      title: args.title,
      slug: args.slug,
      content: args.content,
      author: args.author,
      readTime: args.readTime,
      posterUrl: args.posterUrl,
      isPublished: args.isPublished,
      tags: args.tags,
      categoryId: args.categoryId,
      metaTitle: args.metaTitle,
      metaDescription: args.metaDescription,
    });
    return blogId;
  },
});

export const get = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx,args) => {
    const results = await ctx.db.query("blogs").paginate(args.paginationOpts);
    return {
      ...results,
      page: (
        await Promise.all(
          results.page.map(async (blog) => {
            const posterUrlString = blog.posterUrl
            ? await ctx.storage.getUrl(blog.posterUrl)
            : undefined;
  
          let category = null;
          if (blog.categoryId) {
            category = await ctx.db.get(blog.categoryId);
          }
  
          return {
            ...blog,
            posterUrl: posterUrlString,
            category: category,
          };
          }
        )
        )
      )
    }
  },
});

export const getNotP = query({
  args:{},
  handler: async (ctx) => {
    const results = await ctx.db.query("blogs").collect();
    return results;
  },
})

export const getById = query({
  args: {
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      if (!args.slug) {
        return null;
      }

      const blog = await ctx.db
        .query("blogs")
        .filter((q) => q.and(q.eq(q.field("slug"), args.slug)))
        .first();
      if (!blog) {
        return null;
      }
      const posterUrlString = blog.posterUrl
        ? await ctx.storage.getUrl(blog.posterUrl)
        : undefined;

      return {
        ...blog,
        posterUrl: posterUrlString,
      };
    } catch (error) {
      console.error("Error fetching blog data:", error);
      return { error: "An error occurred while fetching blog data." };
    }
  },
});
export const incrementViews = mutation({
  args: {
    blogId: v.id("blogs"), // Nhận ID của bài blog
  },
  handler: async (ctx, { blogId }) => {
    const blog = await ctx.db.get(blogId);
    if (blog) {
      await ctx.db.patch(blogId, {
        views: (blog.views || 0) + 1,
      });
    }
    return blogId;
  },
});
