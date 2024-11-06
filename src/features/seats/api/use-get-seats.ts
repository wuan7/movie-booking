import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface UseGetSeatsProps {
    rowId?: Id<"rows">;
}

export type GetSeatsReturnType = typeof api.seats.get._returnType;
export const useGetSeats = ({rowId} : UseGetSeatsProps) => {
    const data = useQuery(api.seats.get, {rowId});

    const isLoading = data === undefined;

    return {data, isLoading};
}