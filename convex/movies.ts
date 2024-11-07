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
    id: v.optional(v.id("movies")),
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

export const update = mutation({
  args: {
    id: v.id("movies"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    director: v.optional(v.string()),
    duration: v.optional(v.number()),
    releaseDate: v.optional(v.string()),
    nation: v.optional(v.string()),
    posterUrl: v.optional(v.id("_storage")),
    trailerUrl: v.optional(v.string()),
    genre: v.optional(v.array(v.string())),
    cast: v.optional(v.array(v.string())),
    status: v.optional(
      v.union(
        v.literal("upcoming"),
        v.literal("showing"),
        v.literal("not_showing")
      )
    ),
    age: v.optional(
      v.union(
        v.literal("18"),
        v.literal("16"),
        v.literal("13"),
        v.literal("K"),
        v.literal("P")
      )
    ),
  },
  handler: async (ctx, args) => {
    const movieId = args.id;
    const movie = await ctx.db.get(movieId);

    if (!movie) {
      throw new Error("Movie not found");
    }
    if (movie) {
      const updatedMovie = {
        ...movie,
      };
      if (args.title) {
        updatedMovie.title = args.title;
      }
      if (args.description) {
        updatedMovie.description = args.description;
      }
      if (args.director) {
        updatedMovie.director = args.director;
      }
      if (args.duration) {
        updatedMovie.duration = args.duration;
      }
      if (args.releaseDate) {
        updatedMovie.releaseDate = args.releaseDate;
      }
      if (args.nation) {
        updatedMovie.nation = args.nation;
      }
      if (args.posterUrl) {
        updatedMovie.posterUrl = args.posterUrl;
      }
      if (args.trailerUrl) {
        updatedMovie.trailerUrl = args.trailerUrl;
      }
      if (args.genre) {
        updatedMovie.genre = args.genre;
      }
      if (args.cast) {
        updatedMovie.cast = args.cast;
      }
      if (args.status) {
        updatedMovie.status = args.status;
      }
      if (args.age) {
        updatedMovie.age = args.age;
      }
      await ctx.db.patch(args.id, updatedMovie);
      return args.id;
    }
  },
});
