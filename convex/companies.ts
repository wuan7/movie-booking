import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const create = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    logoUrl: v.optional(v.id("_storage")),
    posterUrl: v.optional(v.id("_storage")),
    storesNumber: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      console.error("Failed to get user ID. User is not authenticated.");
      throw new Error("Unauthorized");
    }

    const cinemaId = await ctx.db.insert("cinemaCompanies", {
      name: args.name,
      description: args.description,
      logoUrl: args.logoUrl,
      posterUrl: args.posterUrl,
      storesNumber: args.storesNumber,
    });
    return cinemaId;
  },
});

export const get = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      return [];
    }

    const companies = await ctx.db.query("cinemaCompanies").collect();

    const companiesWithImageUrls = await Promise.all(
      companies.map(async (company) => {
        if (company.posterUrl || company.logoUrl) {
          const posterUrlString = company.posterUrl
            ? await ctx.storage.getUrl(company.posterUrl)
            : undefined;
          const logoUrlString = company.logoUrl
            ? await ctx.storage.getUrl(company.logoUrl)
            : undefined;
          return {
            ...company,
            posterUrl: posterUrlString,
            logoUrl: logoUrlString,
          };
        }
        return company;
      })
    );

    return companiesWithImageUrls;
  },
});
