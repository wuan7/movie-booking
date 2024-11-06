import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";


export type GetMoviesReturnType = typeof api.movies.get._returnType;
export const useGetMovies = () => {
    const data = useQuery(api.movies.get);

    const isLoading = data === undefined;

    return {data, isLoading};
}