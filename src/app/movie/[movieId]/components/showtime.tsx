import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Id } from "../../../../../convex/_generated/dataModel";
import { useDate } from "@/features/showtimes/store/use-showtime";
import {
  GetShowtimesByBranchIdAndDateReturnType,
  useGetShowtimesByBranchIdAndDate,
} from "../../../../features/showtimes/api/use-get-showtimes-by-branch-and-date";
import { TriangleAlert } from "lucide-react";
import { useMovieId } from "@/hooks/use-movie-id";
import { useCurrentShowtime } from "@/features/showtimes/store/use-showtime";
import { useCreateShowtimeModal } from "@/features/showtimes/store/use-create-showtime-model";
interface ShowtimeProps {
  branchId: Id<"branches"> | undefined;
}

export const Showtime = ({ branchId }: ShowtimeProps) => {
  const [, setOpen] = useCreateShowtimeModal();
  const [, setCurrentShowtime] = useCurrentShowtime();
  const movieId = useMovieId();
  const [date] = useDate();
  const { data, isLoading } = useGetShowtimesByBranchIdAndDate({
    branchId,
    showDate: date,
    movieId,
  });

  const handleClick = (
    showtime: GetShowtimesByBranchIdAndDateReturnType | undefined
  ) => {
    if (!showtime) return;
    setCurrentShowtime(showtime);
    setOpen(true);
  };

  if (isLoading) {
    return (
      <div className="">
        <Skeleton className="h-4 w-12 " />
        <Skeleton className="h-9 w-28 mt-2" />
      </div>
    );
  }
  if (!data || data.length === 0 || data === undefined) {
    return (
      <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
        <TriangleAlert className="size-6  text-muted-foreground text-red-500" />
        <p className="text-sm text-muted-foreground">
          Suất chiếu không tìm thấy.
        </p>
      </div>
    );
  }
  return (
    <div>
      <p className="mb-2">Standard</p>
      <div className="flex flex-wrap gap-2">
        {data?.map((showtime) => {
          const formattedStartTime = showtime?.startTime.slice(11, 16);
          const formattedEndTime = showtime?.endTime.slice(11, 16);

          return (
            <Button
              key={showtime._id}
              variant={"outline"}
              className="bg-transparent"
              onClick={() => handleClick([showtime])}
            >
              {formattedStartTime} ~ {formattedEndTime}
            </Button>
          );
        })}
      </div>
    </div>
  );
};
