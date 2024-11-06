import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const create = mutation({
  args: {
    slug: v.string(),
    title: v.string(),
    content: v.string(),
    posterUrl: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const blogId = await ctx.db.insert("blogPosts", {
      slug: args.slug,
      title: args.title,
      content: args.content,
      posterUrl: args.posterUrl,
    });
    return blogId;
  },
});

export const getByBlogId = query({
  args: {
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    const posts = await ctx.db
      .query("blogPosts")
      .filter((q) => q.eq(q.field("slug"), args.slug))
      .collect();

    const postsWithPosterUrls = await Promise.all(
      posts.map(async (post) => {
        if (post.posterUrl) {
          const posterUrlString = post.posterUrl
            ? await ctx.storage.getUrl(post.posterUrl)
            : undefined;
          return {
            ...post,
            posterUrl: posterUrlString,
          };
        }
        return post;
      })
    );

    return postsWithPosterUrls;
  },
});
