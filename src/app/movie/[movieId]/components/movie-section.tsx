import { CinemaChain } from "./cinema-chain";
import { MovieBrand } from "./movie-brand";
import { useGetCompanies } from "@/features/companies/api/use-get-companies";
import { useEffect, useState } from "react";
import { CreateBranchModal } from "@/features/branches/components/create-branch-modal";
import { useDate } from "@/features/showtimes/store/use-showtime";
import {
  GetShowtimesByDateReturnType,
  useGetShowtimesByDate,
} from "@/features/showtimes/api/use-get-showtimes-by-date";
import { format } from "date-fns";
import { useGetShowtimesByCinemaIdAndDate } from "@/features/showtimes/api/use-get-showtimes-by-cinema-company-and-date";
import { useMovieId } from "@/hooks/use-movie-id";
const uniqueBranchData = (data: GetShowtimesByDateReturnType | undefined) => {
  const seenBranchIds = new Set();

  return (
    data?.filter((item) => {
      const { branchId } = item; //lấy branchId
      if (!seenBranchIds.has(branchId)) {
        seenBranchIds.add(branchId);
        return true; // Giữ đối tượng nếu branchId chưa thấy
      }
      return false; // Bỏ qua nếu branchId đã thấy
    }) || []
  ); // Trả về mảng rỗng nếu data là undefined
};

export const MovieSection = () => {
  const movieId = useMovieId();
  const [date, setDate] = useDate();
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>();
  const [all, setAll] = useState<boolean>(false);
  const { data: companies, isLoading: companiesLoading } = useGetCompanies();
  const {
    data: showtimesByCinemaIdAndDate,
    isLoading: showtimesByCinemaIdAndDateLoading,
  } = useGetShowtimesByCinemaIdAndDate({
    cinemaCompanyId: selectedCompanyId,
    showDate: date,
    movieId,
  });
  const { data: showtimesByDate, isLoading: showtimesByDateLoading } =
    useGetShowtimesByDate({ showDate: date, movieId });
  const branchChainIds = uniqueBranchData(showtimesByDate);
  const branchChainIdsWithCinemaId = uniqueBranchData(
    showtimesByCinemaIdAndDate
  );
  useEffect(() => {
    const currentDate = format(new Date(), "MM/dd/yyyy");
    setDate(currentDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mt-3 px-4 overflow-hidden h-full md:mx-auto">
      <div className="flex flex-col gap-y-2 mb-2">
        <CreateBranchModal />
        <CinemaChain
          setAll={setAll}
          companies={companies}
          companiesLoading={companiesLoading}
          setSelectedCompanyId={setSelectedCompanyId}
          selectedCompanyId={selectedCompanyId}
        />
        <MovieBrand
          all={all}
          branches={branchChainIdsWithCinemaId}
          branchesLoading={showtimesByCinemaIdAndDateLoading}
          allBranches={branchChainIds}
          allBranchesLoading={showtimesByDateLoading}
          selectedCompanyId={selectedCompanyId}
        />
      </div>
    </div>
  );
};
