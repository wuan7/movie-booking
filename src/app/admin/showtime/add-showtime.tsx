import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Select } from "@radix-ui/react-select";
import { TriangleAlert } from "lucide-react";
import { useState } from "react";
import { Id } from "../../../../convex/_generated/dataModel";
import { useGetCompanies } from "@/features/companies/api/use-get-companies";
import { useGetBranchesCompanyId } from "@/features/branches/api/use-get-branches-company-id.ts";
import { useGetRooms } from "@/features/rooms/api/use-get-rooms";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/date-picker";
import { format } from "date-fns";
import { toast } from "sonner";
import { useCreateShowtime } from "@/features/showtimes/api/use-create-showtime";
import { useGetMoviesStatus } from "@/features/movies/api/use-get-movies-status";

type CreateShowtimeValues = {
  movieId: Id<"movies">;
  cinemaCompanyId: Id<"cinemaCompanies">;
  branchId: Id<"branches">;
  screeningRoomId: Id<"screeningRooms">;
  showDate: string;
  startTime: string;
  endTime: string;
  ticketPrices: {
    seatType: "standard" | "vip" | "couple";
    price: number;
  }[];
};

export const AddShowtime = () => {
  const [isPending, setIsPending] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState<Id<"movies">>();
  const [selectedCompanyId, setSelectedCompanyId] =
    useState<Id<"cinemaCompanies">>();
  const [selectedBranchId, setSelectedBranchId] = useState<Id<"branches">>();
  const [selectedRoomId, setSelectedRoomId] = useState<Id<"screeningRooms">>();

  const [ticketPrices, setTicketPrices] = useState<
    {
      seatType: "standard" | "vip" | "couple";
      price: number;
    }[]
  >([
    { seatType: "standard", price: 80000 },
    { seatType: "vip", price: 100000 },
    { seatType: "couple", price: 150000 },
  ]);
  const [showDate, setShowDate] = useState<Date>();
  const [startTime, setStartTime] = useState<Date>();
  const [endTime, setEndTime] = useState<Date>();
  const [startTimeValue, setStartTimeValue] = useState<string>("22:00");
  const [endTimeValue, setEndTimeValue] = useState<string>("23:00");

  const { data: movies, isLoading: moviesLoading } = useGetMoviesStatus({
    status: "showing",
  });
  const { data: companies, isLoading: companiesLoading } = useGetCompanies();
  const { data: branches, isLoading: branchesLoading } =
    useGetBranchesCompanyId({
      cinemaCompanyId: selectedCompanyId as Id<"cinemaCompanies">,
    });
  const { data: rooms, isLoading: roomsLoading } = useGetRooms({
    branchId: selectedBranchId as Id<"branches">,
  });

  const { mutate } = useCreateShowtime();

  const handlePriceChange = (
    seatType: "standard" | "vip" | "couple",
    price: number
  ) => {
    setTicketPrices((prevPrices) =>
      prevPrices.map((tp) => (tp.seatType === seatType ? { ...tp, price } : tp))
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setIsPending(true);
      if (!selectedBranchId) {
        toast.error("Please select a branch");
        return;
      }
      if (!selectedCompanyId) {
        toast.error("Please select a cinema");
        return;
      }

      if (!selectedRoomId) {
        toast.error("Please select a room");
        return;
      }
      if (!selectedMovieId) {
        toast.error("Please select a movie");
        return;
      }

      if (!showDate) {
        toast.error("Please select a show date");
        return;
      }
      if (!startTime || !startTimeValue || !endTime || !endTimeValue) {
        toast.error("Please select a start time and end time");
        return;
      }
      const isValidPrices = ticketPrices.every((tp) => tp.price > 0);

      if (!isValidPrices) {
        toast.error("Please ensure all seat prices are greater than 0.");
        return;
      }

      const [startHours, startMinutes] = startTimeValue
        .split(":")
        .map((str) => parseInt(str, 10));
      const newDate = new Date(
        startTime.getFullYear(),
        startTime.getMonth(),
        startTime.getDate(),
        startHours,
        startMinutes
      );

      const localStartTimeISO = newDate
        .toLocaleString("sv-SE", {
          timeZone: "Asia/Ho_Chi_Minh", // hoặc múi giờ bạn cần
        })
        .replace(" ", "T");

      const [endHours, endMinutes] = endTimeValue
        .split(":")
        .map((str) => parseInt(str, 10));
      const newEndDate = new Date(
        endTime.getFullYear(),
        endTime.getMonth(),
        endTime.getDate(),
        endHours,
        endMinutes
      );
      const localEndTimeISO = newEndDate
        .toLocaleString("sv-SE", {
          timeZone: "Asia/Ho_Chi_Minh", // hoặc múi giờ bạn cần
        })
        .replace(" ", "T");

      const formattedShowDate = format(showDate, "MM/dd/yyyy");

      const values: CreateShowtimeValues = {
        movieId: selectedMovieId,
        screeningRoomId: selectedRoomId,
        branchId: selectedBranchId,
        cinemaCompanyId: selectedCompanyId,
        ticketPrices,
        showDate: formattedShowDate,
        startTime: localStartTimeISO,
        endTime: localEndTimeISO,
      };

      mutate(values, {
        onSuccess: () => {
          toast.success("showtime created successfully");
        },
        onError: (error) => {
          toast.error("Failed to create showtime");
          console.log(error);
        },
      });
    } catch (error) {
      toast.error("Failed to create showtime");
      console.log(error);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div>
      <h1>Add showtime</h1>
      <div className="">
        <Select
          onValueChange={(value: Id<"movies">) => setSelectedMovieId(value)}
          required
          disabled={isPending}
        >
          <SelectTrigger className="md:w-[380px] w-full">
            <SelectValue placeholder="Select movie" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {moviesLoading ? (
                <>
                  <div className="flex flex-col gap-y-2 ">
                    <div className="flex items-center gap-x-3">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-8 w-[250px]" />
                      </div>
                    </div>
                    <div className="flex items-center gap-x-3">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-8 w-[250px]" />
                      </div>
                    </div>
                    <div className="flex items-center gap-x-3">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-8 w-[250px]" />
                      </div>
                    </div>
                    <div className="flex items-center gap-x-3">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-8 w-[250px]" />
                      </div>
                    </div>
                    <div className="flex items-center gap-x-3">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-8 w-[250px]" />
                      </div>
                    </div>
                  </div>
                </>
              ) : !movies ? (
                <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
                  <TriangleAlert className="size-6  text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    No movie found
                  </span>
                </div>
              ) : (
                <>
                  {movies.map((movie) => (
                    <SelectItem key={movie._id} value={movie._id}>
                      <div className="flex items-center">
                        <Avatar className="size-10 hover:opacity-75 transition mr-2">
                          <AvatarImage src={movie.posterUrl || ""} />
                          <AvatarFallback>
                            {movie.title.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <p className="font-semibold">{movie.title}</p>
                      </div>
                    </SelectItem>
                  ))}
                </>
              )}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="">
        <Select
          onValueChange={(value: Id<"cinemaCompanies">) =>
            setSelectedCompanyId(value)
          }
          required
          disabled={isPending}
        >
          <SelectTrigger className="md:w-[380px] w-full">
            <SelectValue placeholder="Select cinema chain" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {companiesLoading ? (
                <>
                  <div className="flex flex-col gap-y-2 ">
                    <div className="flex items-center gap-x-3">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-8 w-[250px]" />
                      </div>
                    </div>
                    <div className="flex items-center gap-x-3">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-8 w-[250px]" />
                      </div>
                    </div>
                    <div className="flex items-center gap-x-3">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-8 w-[250px]" />
                      </div>
                    </div>
                    <div className="flex items-center gap-x-3">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-8 w-[250px]" />
                      </div>
                    </div>
                    <div className="flex items-center gap-x-3">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-8 w-[250px]" />
                      </div>
                    </div>
                  </div>
                </>
              ) : !companies ? (
                <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
                  <TriangleAlert className="size-6  text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    No cinema-chain found
                  </span>
                </div>
              ) : (
                <>
                  {companies.map((company) => (
                    <SelectItem
                      key={company._id}
                      value={company._id}
                      className={`${selectedCompanyId === company._id ? "bg-blue-400" : ""}`}
                    >
                      <div className="flex items-center">
                        <Avatar className="size-10 hover:opacity-75 transition mr-2">
                          <AvatarImage src={company.logoUrl || ""} />
                          <AvatarFallback>
                            {company.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <p className="font-semibold">{company.name}</p>
                      </div>
                    </SelectItem>
                  ))}
                </>
              )}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div>
        {branches && branches.length > 0 && (
          <Select
            onValueChange={(value: Id<"branches">) =>
              setSelectedBranchId(value)
            }
            required
            disabled={isPending}
          >
            <SelectTrigger className="md:w-[380px] w-full">
              <SelectValue placeholder="Select branch" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {branchesLoading ? (
                  <>
                    <div className="flex flex-col gap-y-2 ">
                      <div className="flex items-center gap-x-3">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-8 w-[250px]" />
                        </div>
                      </div>
                      <div className="flex items-center gap-x-3">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-8 w-[250px]" />
                        </div>
                      </div>
                      <div className="flex items-center gap-x-3">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-8 w-[250px]" />
                        </div>
                      </div>
                      <div className="flex items-center gap-x-3">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-8 w-[250px]" />
                        </div>
                      </div>
                      <div className="flex items-center gap-x-3">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-8 w-[250px]" />
                        </div>
                      </div>
                    </div>
                  </>
                ) : !branches ? (
                  <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
                    <TriangleAlert className="size-6  text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      No branches found
                    </span>
                  </div>
                ) : (
                  <>
                    {branches.map((branch) => (
                      <SelectItem key={branch._id} value={branch._id}>
                        <div className="flex items-center">
                          <Avatar className="size-10 hover:opacity-75 transition mr-2">
                            <AvatarImage src={branch.logoUrl || ""} />
                            <AvatarFallback>
                              {branch.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <p className="font-semibold">{branch.name}</p>
                        </div>
                      </SelectItem>
                    ))}
                  </>
                )}
              </SelectGroup>
            </SelectContent>
          </Select>
        )}
      </div>
      <div>
        {rooms && (
          <Select
            onValueChange={(value: Id<"screeningRooms">) =>
              setSelectedRoomId(value)
            }
            required
            disabled={isPending}
          >
            <SelectTrigger className="md:w-[380px] w-full">
              <SelectValue placeholder="Select room" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {roomsLoading ? (
                  <>
                    <div className="flex flex-col gap-y-2 ">
                      <div className="flex items-center gap-x-3">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-8 w-[250px]" />
                        </div>
                      </div>
                      <div className="flex items-center gap-x-3">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-8 w-[250px]" />
                        </div>
                      </div>
                      <div className="flex items-center gap-x-3">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-8 w-[250px]" />
                        </div>
                      </div>
                      <div className="flex items-center gap-x-3">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-8 w-[250px]" />
                        </div>
                      </div>
                      <div className="flex items-center gap-x-3">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-8 w-[250px]" />
                        </div>
                      </div>
                    </div>
                  </>
                ) : rooms.length <= 0 || rooms === undefined ? (
                  <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
                    <TriangleAlert className="size-6  text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      No room found
                    </span>
                  </div>
                ) : (
                  <>
                    {rooms.length > 0 &&
                      rooms.map((room) => (
                        <SelectItem key={room._id} value={room._id}>
                          <div className="flex items-center">
                            <p className="font-semibold">{room.name}</p>
                          </div>
                        </SelectItem>
                      ))}
                  </>
                )}
              </SelectGroup>
            </SelectContent>
          </Select>
        )}
      </div>
      <label htmlFor="">show date</label>
      <DatePicker date={showDate} setDate={setShowDate} disabled={isPending} />

      <form onSubmit={handleSubmit} className="space-y-4">
        <label htmlFor=""> time start</label>
        <Input
          value={startTimeValue}
          onChange={(e) => setStartTimeValue(e.target.value)}
          disabled={isPending}
          required
          autoFocus
          minLength={1}
          placeholder="start time of showtime"
          className="max-w-96"
        />
        <label htmlFor="">date time start</label>
        <DatePicker
          date={startTime}
          setDate={setStartTime}
          disabled={isPending}
        />
        <label htmlFor=""> time end</label>
        <Input
          value={endTimeValue}
          onChange={(e) => setEndTimeValue(e.target.value)}
          disabled={isPending}
          required
          autoFocus
          minLength={1}
          placeholder="end time of showtime"
          className="max-w-96"
        />
        <label htmlFor="">date time end</label>

        <DatePicker date={endTime} setDate={setEndTime} disabled={isPending} />
        <div>
          <h2 className="text-lg font-semibold mb-2">Set Ticket Prices</h2>
          {ticketPrices.map((ticketPrice) => (
            <div
              key={ticketPrice.seatType}
              className="mb-4 flex items-center space-x-4"
            >
              <label className="w-24 capitalize">{ticketPrice.seatType}:</label>
              <Input
                type="number"
                min="0"
                step="1000"
                value={ticketPrice.price}
                onChange={(e) =>
                  handlePriceChange(
                    ticketPrice.seatType,
                    parseFloat(e.target.value)
                  )
                }
                placeholder={`Price for ${ticketPrice.seatType}`}
                className="flex-1"
                required
              />
            </div>
          ))}
        </div>
        <div className="flex justify-end px-5">
          <Button disabled={isPending}>Create</Button>
        </div>
      </form>
    </div>
  );
};
