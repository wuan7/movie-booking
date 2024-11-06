import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface UseGetBookingByUserIdProps {
    userId: Id<'users'>
}
export type GetBookingByUserIdReturnType = typeof api.bookings.getBookingByUserId._returnType;
export const useGetBookingByUserId = ({userId} : UseGetBookingByUserIdProps) => {
    const data = useQuery(api.bookings.getBookingByUserId, { userId });

    const isLoading = data === undefined;

    return {data, isLoading};
}