import Link from "next/link";
import Image from "next/image";
import { useGetMovieRating } from "@/features/messages/api/use-get-movie-rating";
import { Id } from "../../../../../convex/_generated/dataModel";
import { Star } from "lucide-react";
import { useGetMovie } from "@/features/movies/api/use-get-movie";

interface MovieProps {
  movieId: Id<"movies">;
}

export const Movie = ({ movieId }: MovieProps) => {
  const { data: movie } = useGetMovie({ id: movieId });
  const { data: movieRating } = useGetMovieRating({ movieId });
  if (!movie || "error" in movie) {
    return null;
  }
  return (
    <Link
      key={movie._id}
      href={`/movie/${movie._id}`}
      className="border-b border-slate-600 last:border-b-0 pb-2 last:pb-0"
    >
      <div className="flex gap-x-2 ">
        <Image
          src={movie.posterUrl || ""}
          alt={movie.title || ""}
          width={80}
          height={100}
          className="object-contain  rounded-sm"
        />
        <div className="space-y-1">
          <div>
            {movie.age === "18" && (
              <div className="bg-red-500 text-white flex items-center justify-center w-7 h-5 text-xs rounded-sm">
                18 <span>+</span>
              </div>
            )}
            {movie.age === "16" && (
              <div className="bg-orange-500 text-white flex items-center justify-center w-7 h-5 text-xs rounded-sm">
                16 <span>+</span>
              </div>
            )}
            {movie.age === "13" && (
              <div className="bg-yellow-500 text-white flex items-center justify-center w-7 h-5 text-xs rounded-sm">
                13 <span>+</span>
              </div>
            )}
            {movie.age === "P" && (
              <div className="bg-green-500 text-white flex items-center justify-center w-7 h-5 text-xs rounded-sm">
                P <span></span>
              </div>
            )}
            {movie.age === "K" && (
              <div className="bg-blue-500 text-white flex items-center justify-center w-7 h-5 text-xs rounded-sm">
                K <span></span>
              </div>
            )}
          </div>
          <h1 className="font-semibold text-white text-sm">{movie.title}</h1>
          {movie.genre && movie.genre.length > 0 && (
            <p className="text-xs text-muted-foreground">
              {movie.genre.join(", ")}
            </p>
          )}
          <div className="flex items-center gap-x-1">
            <Star className="text-yellow-300 size-3 fill-yellow-300" />
            {movieRating && movieRating?.averageRating > 0 ? (
              <p className="text-white text-xs">{movieRating?.averageRating}</p>
            ) : (
              <p className="text-white text-xs">N/A</p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};
