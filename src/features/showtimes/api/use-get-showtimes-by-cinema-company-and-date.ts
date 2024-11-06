import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

interface UseGetShowtimesByCinemaIdAndDateProps {
    cinemaCompanyId?: string;
    showDate?: string;
    movieId?: string;
}

export type GetShowtimesByCinemaIdAndDateReturnType = typeof api.showtimes.getShowtimesByCinemaCompanyAndDate._returnType;
export const useGetShowtimesByCinemaIdAndDate = ({showDate, cinemaCompanyId, movieId} : UseGetShowtimesByCinemaIdAndDateProps) => {
    const data = useQuery(api.showtimes.getShowtimesByCinemaCompanyAndDate, { cinemaCompanyId, showDate, movieId});

    const isLoading = data === undefined;

    return {data, isLoading};
}