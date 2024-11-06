import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Id } from "../../../../convex/_generated/dataModel";
import { useGetSeats } from "../api/use-get-seats";
interface SeatProps {
  rowId?: Id<"rows"> | undefined;
}


export const Seat = ({ rowId }: SeatProps) => {
  const { data: seats } = useGetSeats({ rowId });
  const [selectedSeat, setSelectedSeat] = useState<boolean>(false);
  
  return (
    <>
      {seats &&
            seats.map((seat) => (
              <div
                key={seat._id}
                className={cn(
                  "h-14 w-14 px-2 py-2  flex flex-col",
                  seat.type === "couple" && "w-28",
                  seat.centerType === "first-left-row" &&
                    "border-l rounded-tl-sm border-t",
                  seat.centerType === "first-right-row" &&
                    "border-r rounded-tr-sm border-t ",
                  seat.centerType === "first-row" && "border-t ",
                  seat.centerType === "middle-left-row" && "border-l ",
                  seat.centerType === "middle-right-row" && "border-r ",
                  seat.centerType === "last-left-row" &&
                    "border-l rounded-bl-sm border-b",
                  seat.centerType === "last-row" && "border-b ",
                  seat.centerType === "last-right-row" &&
                    "border-r border-b rounded-br-sm "
                )}
              >
                <Button
                  className={cn(
                    "size-9  text-purple-600 text-sm font-semibold bg-white hover:bg-white/85",
                    seat.type === "empty" &&
                      "!bg-transparent !text-transparent cursor-default",
                    selectedSeat &&
                      "bg-yellow-400 hover:bg-yellow-400 text-white",
                    seat.type === "couple" && "w-full h-9 bg-pink-500",
                    seat.type === "vip" && "bg-blue-500"
                  )}
                  onClick={() => setSelectedSeat((pre) => !pre)}
                >
                 {seat.number}
                </Button>
              </div>
            ))}
    </>
  );
};
