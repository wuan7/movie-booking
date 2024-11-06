import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

interface UseGetShowtimesByDateProps {
    showDate?: string;
    movieId?: string;
}

export type GetShowtimesByDateReturnType = typeof api.showtimes.getShowtimesByDate._returnType;
export const useGetShowtimesByDate = ({showDate, movieId} : UseGetShowtimesByDateProps) => {
    const data = useQuery(api.showtimes.getShowtimesByDate, {showDate, movieId});

    const isLoading = data === undefined;

    return {data, isLoading};
}