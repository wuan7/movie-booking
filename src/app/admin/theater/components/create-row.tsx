import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";

import { useGetCompanies } from "@/features/companies/api/use-get-companies";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TriangleAlert } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Id } from "../../../../../convex/_generated/dataModel";
import { useCreateRow } from "@/features/rows/api/use-create-row";
import { useGetBranchesCompanyId } from "@/features/branches/api/use-get-branches-company-id.ts";
import { useGetRooms } from "@/features/rooms/api/use-get-rooms";
import { useGetRows } from "@/features/rows/api/use-get-rows";
type CreateRowValues = {
  screeningRoomId: Id<"screeningRooms">;
  rowName: string;
  rowNumber: number;
};
export const CreateRow = () => {
  const [isPending, setIsPending] = useState(false);
  const { mutate } = useCreateRow();
  const { data: companies, isLoading: companiesLoading } = useGetCompanies();
  const [selectedCompanyId, setSelectedCompanyId] =
    useState<Id<"cinemaCompanies">>();
  const [selectedBranchId, setSelectedBranchId] = useState<Id<"branches">>();
  const [selectedRoomId, setSelectedRoomId] = useState<Id<"screeningRooms">>();
  const [rowName, setRowName] = useState("");
  const [rowNumber, setRowNumber] = useState(0);

  const { data: branches, isLoading: branchesLoading } =
    useGetBranchesCompanyId({
      cinemaCompanyId: selectedCompanyId as Id<"cinemaCompanies">,
    });
  const { data: rooms, isLoading: roomsLoading } = useGetRooms({
    branchId: selectedBranchId as Id<"branches">,
  });
  const { data: rows } = useGetRows({
    screeningRoomId: selectedRoomId as Id<"screeningRooms">,
  });
  console.log(rooms);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setIsPending(true);
      if (!selectedBranchId) {
        toast.error("Please select a branch");
        return;
      }

      if (!selectedRoomId) {
        toast.error("Please select a room");
        return;
      }

      const values: CreateRowValues = {
        screeningRoomId: selectedRoomId as Id<"screeningRooms">,
        rowName,
        rowNumber,
      };

      mutate(values, {
        onSuccess: () => {
          toast.success("row created successfully");
        },
        onError: (error) => {
          toast.error("Failed to create row");
          console.log(error);
        },
      });
    } catch (error) {
      toast.error("Failed to create row");
      console.log(error);
    } finally {
      setIsPending(false);
    }
  };
  return (
    <div className="space-y-2">
      Add row
      <div>
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
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          value={rowName}
          onChange={(e) => setRowName(e.target.value)}
          disabled={isPending}
          required
          autoFocus
          minLength={1}
          placeholder="room name"
        />

        <Input
          value={rowNumber}
          onChange={(e) => setRowNumber(Number(e.target.value))}
          disabled={isPending}
          minLength={1}
          placeholder="1"
        />
        <div>
          <Button disabled={isPending}>Create</Button>
        </div>
        {rows && rows.length > 0 && (
          <div className="w-full">
            <h1>Layout row</h1>
            {rows.map((row) => (
              <div key={row._id} className="w-full flex">
                <div className="w-6 bg-blue-500 flex items-center justify-center p-1">
                  {row.rowNumber}
                </div>
                <div className="flex-1 bg-green-500 flex items-center  p-1">
                  {row.rowName}
                </div>
              </div>
            ))}
          </div>
        )}
      </form>
    </div>
  );
};
