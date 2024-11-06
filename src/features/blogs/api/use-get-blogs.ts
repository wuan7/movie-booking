import { usePaginatedQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

const BATCH_SIZE = 4;

export type GetBlogsReturnType = (typeof api.blogs.get._returnType)["page"];
export const useGetBlogs = () => {
  const { results, status, loadMore, isLoading } = usePaginatedQuery(
    api.blogs.get,
    {},
    { initialNumItems: BATCH_SIZE }
  );
  return {
    results,
    status,
    isLoading,
    loadMore: () => loadMore(BATCH_SIZE),
  };
};
