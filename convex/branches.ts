import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const create = mutation({
  args: {
    cinemaCompanyId: v.id("cinemaCompanies"),
    name: v.string(),
    location: v.string(),
    address: v.string(),
    contactNumber: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const brandId = await ctx.db.insert("branches", {
      cinemaCompanyId: args.cinemaCompanyId,
      name: args.name,
      location: args.location,
      address: args.address,
      contactNumber: args.contactNumber,
    });
    return brandId;
  },
});

export const get = query({
  args: {},
  handler: async (ctx) => {
    const branches = await ctx.db.query("branches").collect();

    // Sử dụng Promise.all để duyệt qua các branch
    const branchesWithLogoUrlsCompanies = await Promise.all(
      branches.map(async (branch) => {
        const companyId = branch.cinemaCompanyId as Id<"cinemaCompanies">;
        const company = await ctx.db.get(companyId);
        if (!company) {
          return {
            ...branch,
          };
        }
        const logoUrlString = company.logoUrl
          ? await ctx.storage.getUrl(company.logoUrl)
          : undefined;
        return {
          ...branch,
          logoUrl: logoUrlString,
        };
      })
    );

    return branchesWithLogoUrlsCompanies;
  },
});
export const getByCompanyId = query({
  args: {
    cinemaCompanyId: v.optional(v.id("cinemaCompanies")),
  },
  handler: async (ctx, args) => {
    if (!args.cinemaCompanyId) {
      return;
    }

    const branches = await ctx.db
      .query("branches")
      .withIndex("by_cinemaCompanyId", (q) =>
        q.eq("cinemaCompanyId", args.cinemaCompanyId)
      )
      .collect();
    const company = await ctx.db.get(args.cinemaCompanyId);

    if (!company) {
      return null;
    }
    const branchesWithLogoUrlsCompanies = await Promise.all(
      branches.map(async (branch) => {
        if (!branch.logoUrl) {
          const logoUrlString = company.logoUrl
            ? await ctx.storage.getUrl(company.logoUrl)
            : undefined;
          return {
            ...branch,
            logoUrl: logoUrlString,
          };
        }
        return branch;
      })
    );

    return branchesWithLogoUrlsCompanies;
  },
});
