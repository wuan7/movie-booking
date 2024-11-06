import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const create = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    director: v.string(),
    duration: v.number(),
    releaseDate: v.string(),
    genre: v.array(v.string()),
    cast: v.array(v.string()),
    nation: v.string(),
    posterUrl: v.optional(v.id("_storage")),
    trailerUrl: v.optional(v.string()),
    status: v.union(
      v.literal("upcoming"),
      v.literal("showing"),
      v.literal("not_showing")
    ),
    age: v.union(
      v.literal("18"),
      v.literal("16"),
      v.literal("13"),
      v.literal("K"),
      v.literal("P")
    ),
  },
  handler: async (ctx, args) => {
    const movieId = await ctx.db.insert("movies", {
      title: args.title,
      description: args.description,
      director: args.director,
      duration: args.duration,
      releaseDate: args.releaseDate,
      nation: args.nation,
      posterUrl: args.posterUrl,
      trailerUrl: args.trailerUrl,
      genre: args.genre,
      cast: args.cast,
      status: args.status,
      age: args.age,
    });
    return movieId;
  },
});

export const getById = query({
  args: {
    id: v.id("movies"),
  },
  handler: async (ctx, args) => {
    try {
      if (!args.id) {
        return null;
      }
      const movie = await ctx.db.get(args.id);
      if (!movie) {
        return null;
      }

      const posterUrlString = movie.posterUrl
        ? await ctx.storage.getUrl(movie.posterUrl)
        : undefined;

      return {
        ...movie,
        posterUrl: posterUrlString,
      };
    } catch (error) {
      console.error("Error fetching movie data:", error);
      return { error: "An error occurred while fetching movie data." };
    }
  },
});

export const get = query({
  args: {},
  handler: async (ctx) => {
    const movies = await ctx.db.query("movies").collect();

    const moviesWithPosterUrls = await Promise.all(
      movies.map(async (movie) => {
        if (movie.posterUrl) {
          const posterUrlString = movie.posterUrl
            ? await ctx.storage.getUrl(movie.posterUrl)
            : undefined;
          return {
            ...movie,
            posterUrl: posterUrlString,
          };
        }
        return movie;
      })
    );

    return moviesWithPosterUrls;
  },
});

export const getByStatus = query({
  args: {
    status: v.union(
      v.literal("upcoming"),
      v.literal("showing"),
      v.literal("not_showing")
    ),
  },
  handler: async (ctx, args) => {
    const movies = await ctx.db
      .query("movies")
      .filter((q) => q.and(q.eq(q.field("status"), args.status)))
      .collect();

    const moviesWithPosterUrls = await Promise.all(
      movies.map(async (movie) => {
        if (movie.posterUrl) {
          const posterUrlString = movie.posterUrl
            ? await ctx.storage.getUrl(movie.posterUrl)
            : undefined;
          return {
            ...movie,
            posterUrl: posterUrlString,
          };
        }
        return movie;
      })
    );

    return moviesWithPosterUrls;
  },
});
