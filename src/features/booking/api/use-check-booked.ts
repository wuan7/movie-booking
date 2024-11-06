import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface UseCheckBookedProps {
    userId: Id<"users">;
    movieId: Id<"movies">;
}
export type useCheckBookedReturnType = typeof api.bookings.checkIsBooked._returnType;
export const useCheckBooked = ({userId, movieId} : UseCheckBookedProps) => {
    const data = useQuery(api.bookings.checkIsBooked, { userId, movieId });

    const isLoading = data === undefined;

    return {data, isLoading};
}