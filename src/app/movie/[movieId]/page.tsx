"use client";
import { Button } from "@/components/ui/button";
import { Clock, Earth, Loader, Play, Tag, TriangleAlert } from "lucide-react";
import Image from "next/image";

import { MovieSection } from "./components/movie-section";
import { useGetMovie } from "@/features/movies/api/use-get-movie";
import { useMovieId } from "@/hooks/use-movie-id";
import StickyBox from "react-sticky-box";
import { DateBox } from "./components/date-box";
import { SideListMovie } from "./components/side-list-movie";
import { CommentSection } from "./components/comment-section";

import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { usePanel } from "@/hooks/use-panel";
import { Thread } from "@/features/messages/components/thread";
import { Id } from "../../../../convex/_generated/dataModel";
import { useTrailer } from "@/features/movies/store/use-trailer";
import { useMovieTrailerModal } from "@/features/movies/store/use-movie-trailer-model";
import { useGetBlogs } from "@/features/blogs/api/use-get-blogs";
import { BlogList } from "@/components/blog-list";

const MovieIdPage = () => {
  const movieId = useMovieId();

  const { data: movie, isLoading: movieLoading } = useGetMovie({ id: movieId });
  const { parentMessageId, onClose, userId, onUserIdClose } = usePanel();
  const { results, status, loadMore, isLoading } = useGetBlogs();
  const showPanel = !!parentMessageId;
  const [, setTrailer] = useTrailer();
  const [, setOpen] = useMovieTrailerModal();
  const handleTrailer = (trailer: string) => {
    setTrailer(trailer);
    setOpen(true);
  };

  if (movieLoading) {
    return (
      <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!movie || "error" in movie) {
    return (
      <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
        <TriangleAlert className="size-6  text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          Không tìm thấy phim
        </span>
      </div>
    );
  }
  return (
    <>
      {showPanel && userId && (
        <Drawer open={showPanel}>
          <DrawerContent className="z-50 bg-gradient-to-b   from-[#0F172A] to-[#131d36]">
            <Thread
              messageId={parentMessageId as Id<"messages">}
              onClose={onClose}
              userId={userId}
              onUserIdClose={onUserIdClose}
            />
          </DrawerContent>
        </Drawer>
      )}
      <div className="w-full bg-gradient-to-b   from-[#0F172A] to-[#131d36]">
        <div className=" max-w-7xl mx-auto  ">
          <div className="md:flex">
            <div className="relative w-full h-[400px] md:w-1/3 md:mt-3">
              <Image
                fill
                src={movie.posterUrl || ""}
                alt=""
                className="object-contain"
              />
              <button
                onClick={() => handleTrailer(movie.trailerUrl as string)}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex h-10 w-10 p-1 justify-center items-center rounded-full bg-red-500"
              >
                <Play className="size-5 text-white" />
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
              </button>
            </div>
            <div className=" p-5 w-full md:w-2/3 h-auto flex ">
              <div className="flex flex-col space-y-1">
                <h1 className="text-white mt-5 font-bold">{movie.title}</h1>
                <div>
                  <Button
                    variant="transparent"
                    size="icon"
                    className="gap-x-2  w-full hover:bg-transparent flex justify-start"
                  >
                    <Tag className="size-5 text-yellow-500" />
                    {movie.genre && movie.genre.length > 0 && (
                      <span className="text-xs">{movie.genre.join(", ")}</span>
                    )}
                  </Button>
                  <Button
                    variant="transparent"
                    size="icon"
                    className="gap-x-2  w-full hover:bg-transparent flex justify-start"
                  >
                    <Clock className="size-5 text-yellow-500" />
                    <span className="text-xs">{movie.duration}</span>
                  </Button>
                  <Button
                    variant="transparent"
                    size="icon"
                    className="gap-x-2  w-full hover:bg-transparent flex justify-start"
                  >
                    <Earth className="size-5 text-yellow-500" />
                    <span className="text-xs">{movie.nation}</span>
                  </Button>
                </div>
                <h1 className="text-white  font-bold">Mô tả</h1>
                <p className="text-white text-sm">Đạo diễn: {movie.director}</p>
                {movie.cast && movie.cast.length > 0 && (
                  <p className="text-white text-sm">
                    Diễn viên: {movie.cast.join(", ")}
                  </p>
                )}

                <p className="text-white text-sm">
                  Ngày chiếu: {movie.releaseDate}
                </p>

                <h1 className="text-white  font-bold">Nội dung</h1>
                <p className="text-white text-sm">{movie.description}</p>
              </div>
            </div>
          </div>

          <div className="flex md:flex-row flex-col w-full items-start gap-x-1">
            <div className="md:w-2/3 w-full">
              <div className="">
                <StickyBox
                  offsetTop={115}
                  offsetBottom={10}
                  className="  hidden md:flex z-10"
                >
                  <DateBox />
                </StickyBox>
                <StickyBox
                  offsetTop={66}
                  offsetBottom={10}
                  className="flex md:hidden z-10"
                >
                  <DateBox />
                </StickyBox>
                <div className="!z-0">
                  <MovieSection />
                </div>
              </div>
              <StickyBox offsetTop={10} offsetBottom={10} className="">
                <div className="">
                  <CommentSection />
                </div>
              </StickyBox>
            </div>
            <StickyBox
              offsetTop={115}
              offsetBottom={10}
              className="md:w-1/3 hidden md:flex"
            >
              <div className="shadow-md shadow-white/85 p-2 w-full">
                <SideListMovie />
              </div>
            </StickyBox>
          </div>
          <div className="py-6">
            <BlogList
              blogs={results}
              isLoading={isLoading}
              loadMore={loadMore}
              isLoadingMore={status === "LoadingMore"}
              canLoadMore={status === "CanLoadMore"}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default MovieIdPage;
