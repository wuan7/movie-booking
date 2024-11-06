import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface UseGetMessageProps {
    id: Id<"messages">;
    userId: Id<"users">;
}

export const useGetMessage = ({id, userId} : UseGetMessageProps) => {
    const data = useQuery(api.messages.getById, {id ,userId});

    const isLoading = data === undefined;

    return {data, isLoading};
}