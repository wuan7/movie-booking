import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface UseGetMovieRatingProps {
    movieId: Id<"movies">;
}

export const useGetMovieRating = ({movieId} : UseGetMovieRatingProps) => {
    const data = useQuery(api.messages.getMovieRating, {movieId});

    const isLoading = data === undefined;

    return {data, isLoading};
}