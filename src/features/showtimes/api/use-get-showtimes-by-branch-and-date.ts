import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface UseGetShowtimesByBranchIdAndDateProps {
    branchId?: Id<"branches">;
    showDate?: string;
    movieId?: string;
}

export type GetShowtimesByBranchIdAndDateReturnType = typeof api.showtimes.getShowtimesByBranchAndDate._returnType;
export const useGetShowtimesByBranchIdAndDate = ({showDate, branchId, movieId} : UseGetShowtimesByBranchIdAndDateProps) => {
    const data = useQuery(api.showtimes.getShowtimesByBranchAndDate, { branchId, showDate, movieId});

    const isLoading = data === undefined;

    return {data, isLoading};
}