import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface UseGetRowsProps {
    screeningRoomId?: Id<"screeningRooms">;
}

export type GetRowReturnType = typeof api.rows.get._returnType;
export const useGetRows = ({screeningRoomId} : UseGetRowsProps) => {
    const data = useQuery(api.rows.get, {screeningRoomId});

    const isLoading = data === undefined;

    return {data, isLoading};
}