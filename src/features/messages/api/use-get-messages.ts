import { usePaginatedQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

const BATCH_SIZE = 3;

interface UseGetMessagesProps {
  movieId: Id<"movies">;
  parentMessageId?: Id<"messages">;
}

export type GetMessagesReturnType = typeof api.messages.get._returnType["page"];

export const useGetMessages = ({
  movieId
}: UseGetMessagesProps) => {
  const { results, status, loadMore, isLoading} = usePaginatedQuery(
    api.messages.get,
    {
        movieId
    },
    { initialNumItems: BATCH_SIZE }
  );

  return {
    results,
    status,
    isLoading,
    loadMore: () => loadMore(BATCH_SIZE),

  }
};