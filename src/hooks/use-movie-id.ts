import { useParams } from "next/navigation";

import { Id } from "../../convex/_generated/dataModel";

export const useMovieId = () => {
    const params = useParams();
    return params.movieId as Id<"movies">;
}