import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface UseGetRoomProps {
    screeningRoomId?: Id<"screeningRooms">;
}

export type GetRoomReturnType = typeof api.screeningRooms.getById._returnType;
export const useGetRoom = ({screeningRoomId} : UseGetRoomProps) => {
    const data = useQuery(api.screeningRooms.getById, {screeningRoomId});

    const isLoading = data === undefined;

    return {data, isLoading};
}