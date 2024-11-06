import { Loader, TriangleAlert } from "lucide-react";
import { Movie } from "./movie";
import { useGetMoviesStatus } from "@/features/movies/api/use-get-movies-status";

export const SideListMovie = () => {
  const { data, isLoading } = useGetMoviesStatus({ status: "showing" });
  if (isLoading) {
    return (
      <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }
  if (!data) {
    return (
      <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
        <TriangleAlert className="size-6  text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Không có phim</span>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-white font-bold text-xl">Phim đang chiếu</h1>

      {data.map((movie) => (
        <Movie key={movie._id} movieId={movie._id} />
      ))}
    </div>
  );
};
