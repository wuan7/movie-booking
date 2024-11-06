import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Id } from "../../../../../convex/_generated/dataModel";
import { useGetSeats } from "@/features/seats/api/use-get-seats";
interface SeatProps {
  rowId?: Id<"rows"> | undefined;
}

export const Seat = ({ rowId }: SeatProps) => {
  const { data: seats } = useGetSeats({ rowId });

  return (
    <>
      {seats &&
        seats.map((seat) => (
          <div
            key={seat._id}
            className={cn(
              "h-14 w-14 p-4  flex justify-center items-center ",
              seat.type === "couple" && "w-28 ",
              seat.type === "standard" && "",
              seat.centerType === "first-left-row" &&
                "border-l-2 border-red-500 rounded-tl-sm border-t-2",
              seat.centerType === "first-right-row" &&
                "border-r-2 border-red-500 rounded-tr-sm border-t-2 ",
              seat.centerType === "first-row" && "border-t-2 border-red-500 ",
              seat.centerType === "middle-left-row" &&
                "border-l-2 border-red-500",
              seat.centerType === "middle-right-row" &&
                "border-r-2 border-red-500",
              seat.centerType === "last-left-row" &&
                "border-l-2 rounded-bl-sm border-b-2 border-red-500",
              seat.centerType === "last-row" && "border-b-2 border-red-500 ",
              seat.centerType === "last-right-row" &&
                "border-r-2 border-b-2 rounded-br-sm border-red-500"
            )}
          >
            <Button
              className={cn(
                "size-9  text-purple-600 text-sm font-semibold bg-white hover:bg-white/85",
                seat.type === "empty" &&
                  "!bg-transparent !text-transparent cursor-default",
                seat.type === "couple" &&
                  "w-full h-9 text-white bg-pink-500 hover:bg-pink-500/75",
                seat.type === "standard" &&
                  "text-white bg-purple-500 hover:bg-purple-500/75",
                seat.type === "vip" &&
                  "text-white bg-red-500 hover:bg-red-500/75"
              )}
            >
              {seat.number}
            </Button>
          </div>
        ))}
    </>
  );
};
