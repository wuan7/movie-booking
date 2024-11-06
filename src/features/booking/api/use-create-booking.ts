import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useCallback, useMemo, useState } from "react";
import { Id } from "../../../../convex/_generated/dataModel";

type RequestType = {
  userId?: Id<"users">;
  movieId: Id<"movies">;
  showtimeId: Id<"showtimes">;
  email: string;
  name: string;
  phone: string;
  selectedSeats: seatValue[];
  totalPrice: number;
  paymentMethod: string;
  paidAt?: number;
};
type seatValue = {
  number: string;
  isBooked: boolean;
  status: string;
  type: "standard" | "vip" | "couple" | "empty";
  centerType?:
    | "first-left-row"
    | "first-right-row"
    | "first-row"
    | "middle-left-row"
    | "middle-row"
    | "middle-right-row"
    | "last-left-row"
    | "last-row"
    | "last-right-row"
    | "nomal"
    | undefined;
};
type ResponseType = typeof api.bookings.createBooking._returnType | null;

type Options = {
  onSuccess?: (data: ResponseType) => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
  throwError?: boolean;
};

export const useCreateBooking = () => {
  const [data, setData] = useState<ResponseType>(null);
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<
    "success" | "error" | "settled" | "pending" | null
  >(null);

  const isPending = useMemo(() => status === "pending", [status]);
  const isSuccess = useMemo(() => status === "success", [status]);
  const isError = useMemo(() => status === "error", [status]);
  const isSettled = useMemo(() => status === "settled", [status]);

  const mutation = useMutation(api.bookings.createBooking);

  const mutate = useCallback(
    async (values: RequestType, options?: Options) => {
      try {
        setData(null);
        setError(null);
        setStatus("pending");

        const response = await mutation(values);
        options?.onSuccess?.(response);
        return response;
      } catch (error) {
        setStatus("error");
        options?.onError?.(error as Error);
        if (options?.throwError) {
          throw error;
        }
      } finally {
        setStatus("settled");
        options?.onSettled?.();
      }
    },
    [mutation]
  );

  return { mutate, data, error, isPending, isSuccess, isError, isSettled };
};
