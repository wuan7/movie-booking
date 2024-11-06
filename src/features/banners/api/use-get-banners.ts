import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

export type GetBannersReturnType = typeof api.banners.get._returnType;
export const useGetBanners = () => {
  const data = useQuery(api.banners.get);

  const isLoading = data === undefined;

  return { data, isLoading };
};
