import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GetCompaniesReturnType } from "@/features/companies/api/use-get-companies";
import { TriangleAlert } from "lucide-react";
import { useEffect } from "react";

interface CinemaChainProps {
  companies: GetCompaniesReturnType | undefined;
  companiesLoading: boolean | undefined;
  setSelectedCompanyId: (value: string) => void;
  selectedCompanyId: string | undefined;
  setAll: (value: boolean) => void;
}

export const CinemaChain = ({
  companies,
  companiesLoading,
  setSelectedCompanyId,
  selectedCompanyId,
  setAll,
}: CinemaChainProps) => {
  useEffect(() => {
    setAll(true);
  }, [setAll]);
  const handleOnchange = (value: string) => {
    if (value === "all") {
      setAll(true);
    } else {
      setAll(false);
      setSelectedCompanyId(value);
    }
  };

  return (
    <div className="">
      <Select
        onValueChange={(value: string) => handleOnchange(value)}
        defaultValue="all"
      >
        <SelectTrigger className="md:w-[380px] w-full ">
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
                <SelectItem value="all" className="cursor-pointer">
                  <div className="flex items-center">
                    <Avatar className="size-10 hover:opacity-75 transition mr-2">
                      <AvatarImage src="/cinema/dexuat-icon.svg" />
                      <AvatarFallback>A</AvatarFallback>
                    </Avatar>
                    <p className="font-semibold">All</p>
                  </div>
                </SelectItem>
                {companies.map((company) => (
                  <SelectItem
                    key={company._id}
                    value={company._id}
                    className={`${selectedCompanyId === company._id ? "bg-blue-400" : ""} cursor-pointer`}
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
  );
};
