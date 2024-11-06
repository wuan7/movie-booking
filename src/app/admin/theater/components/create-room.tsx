import { useState } from "react";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

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
import { useGetBranchesCompanyId } from "@/features/branches/api/use-get-branches-company-id.ts";
import { Id } from "../../../../../convex/_generated/dataModel";
import { useCreateRoom } from "@/features/rooms/api/use-create-room";
type CreateRoomValues = {
  branchId: Id<"branches">;
  name: string;
  totalSeats?: number;
  description?: string;
};

export const CreateRoom = () => {
  const [name, setName] = useState("");

  const [isPending, setIsPending] = useState(false);
  const { mutate } = useCreateRoom();
  const { data: companies, isLoading: companiesLoading } = useGetCompanies();
  const [selectedCompanyId, setSelectedCompanyId] =
    useState<Id<"cinemaCompanies">>();
  const [selectedBranchId, setSelectedBranchId] = useState<Id<"branches">>();
  const [description, setDescription] = useState("");
  const [totalSeats, setTotalSeats] = useState(0);

  const { data: branches, isLoading: branchesLoading } =
    useGetBranchesCompanyId({
      cinemaCompanyId: selectedCompanyId as Id<"cinemaCompanies">,
    });
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setIsPending(true);
      if (!selectedBranchId) {
        toast.error("Please select a branch");
        return;
      }

      const values: CreateRoomValues = {
        branchId: selectedBranchId as Id<"branches">,
        name,
        totalSeats,
        description,
      };

      mutate(values, {
        onSuccess: () => {
          toast.success("room created successfully");
          // handleClose();
        },
        onError: (error) => {
          toast.error("Failed to create room");
          console.log(error);
        },
      });
    } catch (error) {
      toast.error("Failed to create room");
      console.log(error);
    } finally {
      setIsPending(false);
    }
  };
  return (
    <div className="space-y-2">
      Add Screen room
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
        {branches && (
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
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isPending}
          required
          autoFocus
          minLength={2}
          placeholder="room name"
        />
        <Textarea
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          placeholder="description..."
          disabled={isPending}
        />

        <Input
          value={totalSeats}
          onChange={(e) => setTotalSeats(Number(e.target.value))}
          disabled={isPending}
          minLength={1}
          placeholder="80 seats"
        />
        <div>
          <Button disabled={isPending}>Create</Button>
        </div>
      </form>
    </div>
  );
};
