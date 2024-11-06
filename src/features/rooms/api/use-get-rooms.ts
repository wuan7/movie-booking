import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface UseGetRoomsProps {
    branchId?: Id<"branches">;
}

export type GetRoomsReturnType = typeof api.screeningRooms.get._returnType;
export const useGetRooms = ({branchId} : UseGetRoomsProps) => {
    const data = useQuery(api.screeningRooms.get, {branchId});

    const isLoading = data === undefined;

    return {data, isLoading};
}