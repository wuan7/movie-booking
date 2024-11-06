import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface UseGetMovieProps {
    id: Id<"movies">;
}
export type GetMovieReturnType = typeof api.movies.getById._returnType;
export const useGetMovie = ({id} : UseGetMovieProps) => {
    const data = useQuery(api.movies.getById, { id });

    const isLoading = data === undefined;

    return {data, isLoading};
}