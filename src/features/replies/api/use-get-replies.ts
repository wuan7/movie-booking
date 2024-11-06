import { usePaginatedQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

const BATCH_SIZE = 3;

interface UseGetRepliesProps {
  movieId: Id<"movies">;
  messageId: Id<"messages">;
}

export type GetRepliesReturnType = typeof api.replies.get._returnType["page"];

export const useGetReplies = ({
  movieId,
  messageId
}: UseGetRepliesProps) => {
  const { results, status, loadMore} = usePaginatedQuery(
    api.replies.get,
    {
        movieId,
        messageId
    },
    { initialNumItems: BATCH_SIZE }
  );

  return {
    results,
    status,
    loadMore: () => loadMore(BATCH_SIZE),

  }
};