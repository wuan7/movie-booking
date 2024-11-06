import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

interface UseGetMoviesStatusProps {
    status: "upcoming" | "showing" | "not_showing";
}

export type GetMoviesStatusReturnType = typeof api.movies.getByStatus._returnType;
export const useGetMoviesStatus = ({status}: UseGetMoviesStatusProps) => {
    const data = useQuery(api.movies.getByStatus, {status});

    const isLoading = data === undefined;

    return {data, isLoading};
}