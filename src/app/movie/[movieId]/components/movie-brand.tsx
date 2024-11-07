import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Showtime } from "./showtime";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { GetShowtimesByDateReturnType } from "@/features/showtimes/api/use-get-showtimes-by-date";
import { GetShowtimesByCinemaIdAndDateReturnType } from "@/features/showtimes/api/use-get-showtimes-by-cinema-company-and-date";
interface MovieBrandProps {
  branches: GetShowtimesByCinemaIdAndDateReturnType | undefined;
  branchesLoading: boolean | undefined;
  allBranches: GetShowtimesByDateReturnType | undefined;
  allBranchesLoading: boolean | undefined;
  selectedCompanyId: string | undefined;
  all: boolean;
}

export const MovieBrand = ({
  branches,
  branchesLoading,
  allBranches,
  allBranchesLoading,
  all,
}: MovieBrandProps) => {
  console.log("all", allBranches);
  if (branchesLoading || allBranchesLoading) {
    return (
      <>
        <div className="mt-2 shadow-md shadow-white/85 p-3">
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1" className=" p-2">
              <AccordionTrigger className="">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[200px] md:w-[500px]" />
                    <Skeleton className="h-4 w-[200px] md:w-[500px]" />
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-white space-y-2"></AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </>
    );
  }

  if (all) {
    if (allBranches && allBranches.length > 0 && allBranches !== undefined) {
      return (
        <div className="mt-2 shadow-md shadow-white/85 p-3">
          <Accordion type="single" collapsible>
            {allBranches?.map((branch) => (
              <AccordionItem
                key={branch._id}
                value={branch._id}
                className=" p-2 last:border-b-0"
              >
                <AccordionTrigger className="text-white hover:no-underline">
                  <div className="flex items-center gap-x-3">
                    <Image
                      src={branch.logoUrl || ""}
                      alt={branch.branchName || ""}
                      width={40}
                      height={40}
                      className="rounded-sm"
                    />
                    <div className="flex flex-col items-start justify-center">
                      <h1 className="font-semibold text-sm  text-white">
                        {branch.branchName}
                      </h1>
                      <p className="text-sm text-muted-foreground text-start">
                        {branch.branchAddress}
                      </p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-white space-y-2">
                  <Showtime branchId={branch.branchId} />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      );
    }
    <div className="mt-2 shadow-md shadow-white/85 p-3">
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1" className=" p-2">
          <AccordionTrigger className="">
            <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
              <Image src="/not-found.svg" alt="logo" width={100} height={100} />

              <p className="text-sm text-muted-foreground text-white">
                Úi, Suất chiếu không tìm thấy.
              </p>
              <span className="text-xs text-muted-foreground">
                Bạn hãy thử tìm ngày khác nhé
              </span>
            </div>
          </AccordionTrigger>
        </AccordionItem>
      </Accordion>
    </div>;
  }
  return (
    <div>
      {branches && branches.length > 0 && branches !== undefined ? (
        <div className="mt-2 shadow-md shadow-white/85 p-3">
          <Accordion type="single" collapsible>
            {branches?.map((branch) => (
              <AccordionItem
                key={branch._id}
                value={branch._id}
                className=" p-2"
              >
                <AccordionTrigger className="text-white hover:no-underline">
                  <div className="flex items-center gap-x-3">
                    <Image
                      src={branch.logoUrl || ""}
                      alt={branch.branchName || ""}
                      width={40}
                      height={40}
                      className="rounded-sm"
                    />
                    <div className="flex flex-col items-start justify-center">
                      <h1 className="font-semibold text-sm  text-white">
                        {branch.branchName}
                      </h1>
                      <p className="text-sm text-muted-foreground text-start">
                        {branch.branchAddress}
                      </p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-white space-y-2">
                  <Showtime branchId={branch.branchId} />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      ) : (
        <div className="mt-2 shadow-md shadow-white/85 p-3">
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1" className=" p-2">
              <AccordionTrigger className="">
                <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
                  <Image
                    src="/not-found.svg"
                    alt="logo"
                    width={100}
                    height={100}
                  />

                  <p className="text-sm text-muted-foreground text-white">
                    Úi, Hãng chiếu không tìm thấy suất chiếu nào cả.
                  </p>
                  <span className="text-xs text-muted-foreground">
                    Bạn hãy thử tìm hãng chiếu khác nhé!
                  </span>
                </div>
              </AccordionTrigger>
            </AccordionItem>
          </Accordion>
        </div>
      )}
    </div>
  );
};
