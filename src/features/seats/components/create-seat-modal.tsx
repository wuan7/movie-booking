import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
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

import { Id } from "../../../../convex/_generated/dataModel";
import { useGetBranchesCompanyId } from "@/features/branches/api/use-get-branches-company-id.ts";
import { useGetRooms } from "@/features/rooms/api/use-get-rooms";
import { useGetRows } from "@/features/rows/api/use-get-rows"; 
import { useCreateSeatModal } from "../store/use-create-seat-model";
import { useCreateSeat } from "../api/use-create-seat";
import { SeatLayout } from "./seat-layout";
import { useRows, useRowsLoading } from "../store/use-seats";
type CreateSeatValues = {
  rowId: Id<'rows'>;
  number: string;
  type: "standard" | "vip" | "couple" | "empty";
  centerType?: "first-left-row" | "first-right-row" | "first-row" | "middle-left-row" | "middle-row" | "middle-right-row" | "last-left-row" | "last-row" | "last-right-row" | "nomal";
};

export const CreateSeatModal = () => {
  const [open, setOpen] = useCreateSeatModal();
  const [, setRowsSeat ] = useRows();
  const [, setRowsLoading ] = useRowsLoading();
  const [isPending, setIsPending] = useState(false);
  const { mutate } = useCreateSeat();
  const { data: companies, isLoading: companiesLoading } = useGetCompanies();
  const [selectedCompanyId, setSelectedCompanyId] =
    useState<Id<"cinemaCompanies">>();
  const [selectedBranchId, setSelectedBranchId] = useState<Id<"branches">>();
  const [selectedRoomId, setSelectedRoomId] = useState<Id<"screeningRooms">>();
  const [selectedRowId, setSelectedRowId] = useState<Id<"rows">>();
  const [number, setNumber] = useState("");
  const [type, setType] = useState<"standard" | "vip" | "couple" | "empty">("standard");
  const [centerType, setCenterType] = useState<"first-left-row" | "first-right-row" | "first-row" | "middle-left-row" | "middle-row" | "middle-right-row" | "last-left-row" | "last-row" | "last-right-row" | "nomal" >("nomal");

  

  const { data: branches, isLoading: branchesLoading } =
    useGetBranchesCompanyId({
      cinemaCompanyId: selectedCompanyId as Id<"cinemaCompanies">,
    });
    const { data: rooms, isLoading: roomsLoading } =
    useGetRooms({
      branchId: selectedBranchId as Id<"branches">,
    });
    const { data: rows, isLoading: rowsLoading } =
    useGetRows({
      screeningRoomId: selectedRoomId as Id<"screeningRooms">,
    });

    useEffect(() => {
      if(rows) {
        setRowsSeat(rows);
        setRowsLoading(rowsLoading);
        
      }
      
    }, [rows, setRowsSeat, rowsLoading, setRowsLoading, selectedRowId])


  const handleClose = () => {
    setOpen(false);
    setNumber("");
    setType("standard");
    setCenterType("nomal")
  };

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
      if (!selectedRowId) {
        toast.error("Please select a row");
        return;
      }

      const values: CreateSeatValues = {
        rowId: selectedRowId as Id<"rows">,
        number,
        type,
        centerType
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
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="overflow-y-auto max-h-[80vh] p-6 max-w-5xl ">
        <DialogHeader className="">
          <DialogTitle>Add a seat</DialogTitle>
        </DialogHeader>
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
                 ) : (rooms.length <= 0 || rooms === undefined ) ? (
                   <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
                     <TriangleAlert className="size-6  text-muted-foreground" />
                     <span className="text-sm text-muted-foreground">
                       No room found
                     </span>
                   </div>
                 ) : (
                   <>
                     {rooms.length > 0 && rooms.map((room) => (
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
        <div>
          {rows && (
             <Select
             onValueChange={(value: Id<"rows">) =>
              setSelectedRowId(value)
             }
             required
             disabled={isPending}
           >
             <SelectTrigger className="md:w-[380px] w-full">
               <SelectValue placeholder="Select row" />
             </SelectTrigger>
             <SelectContent>
               <SelectGroup>
                 {rowsLoading ? (
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
                 ) : (rows.length <= 0 || rows === undefined ) ? (
                   <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
                     <TriangleAlert className="size-6  text-muted-foreground" />
                     <span className="text-sm text-muted-foreground">
                       No row found
                     </span>
                   </div>
                 ) : (
                   <>
                     {rows.length > 0 && rows.map((row) => (
                       <SelectItem key={row._id} value={row._id}>
                         <div className="flex items-center">
                           
                           <p className="font-semibold">{row.rowName}</p>
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
      
          <Select
             onValueChange={(value: "standard" | "vip" | "couple" | "empty") =>
              setType(value)
             }
             required
             disabled={isPending}
             defaultValue="standard"
           >
             <SelectTrigger className="md:w-[380px] w-full">
               <SelectValue placeholder="Select type" />
             </SelectTrigger>
             <SelectContent>
               <SelectGroup>
                <SelectItem value="standard">
                  Standard
                </SelectItem>
                <SelectItem value="vip">
                Vip
                </SelectItem>
                <SelectItem value="couple">
                Couple
                </SelectItem>
                <SelectItem value="empty">
                Empty
                </SelectItem>
               </SelectGroup>
             </SelectContent>
           </Select>
           <Select
             onValueChange={(value: "first-left-row" | "first-right-row" | "first-row" | "middle-left-row" | "middle-row" | "middle-right-row" | "last-left-row" | "last-row" | "last-right-row" | "nomal") =>
              setCenterType(value)
             }
             disabled={isPending}
             defaultValue="nomal"
           >
             <SelectTrigger className="md:w-[380px] w-full">
               <SelectValue placeholder="Select position seat type" />
             </SelectTrigger>
             <SelectContent>
               <SelectGroup>
               <SelectItem value={"nomal"}>
                Nomal
                </SelectItem>
                <SelectItem value="first-left-row">
                first-left-row
                </SelectItem>
                <SelectItem value="first-right-row">
                first-right-row
                </SelectItem>
                <SelectItem value="first-row">
                first-row
                </SelectItem>
                <SelectItem value="middle-left-row">
                middle-left-row
                </SelectItem>
                <SelectItem value="middle-row">
                middle-row
                </SelectItem>
                <SelectItem value="middle-right-row">
                middle-right-row
                </SelectItem>
                <SelectItem value="last-left-row">
                last-left-row
                </SelectItem>
                <SelectItem value="last-row">
                last-row
                </SelectItem>
                <SelectItem value="last-right-row">
                last-right-row
                </SelectItem>
               </SelectGroup>
             </SelectContent>
           </Select>
           <Input
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            disabled={isPending}
            required
            autoFocus
            minLength={1}
            placeholder="seat number"
            className="max-w-96"
          />
            <div className="p-5 w-full">

          <SeatLayout />
            </div>
          <div className="flex justify-end px-5">
            <Button disabled={isPending}>Create</Button>
          </div>
        </form>
        
      </DialogContent>
    </Dialog>
  );
};
