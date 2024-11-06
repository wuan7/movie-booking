"use client";
import React from "react";
import Slider from "react-slick";
import { Button } from "../ui/button";
import { CirclePlay, Clock, Earth, Tag } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { useTrailer } from "@/features/movies/store/use-trailer";
import { useMovieTrailerModal } from "@/features/movies/store/use-movie-trailer-model";
import { GetMoviesStatusReturnType } from "@/features/movies/api/use-get-movies-status";
interface MovieSliderProps {
  movies: GetMoviesStatusReturnType | undefined;
  isLoading: boolean | undefined;
}

const MovieSlider = ({ movies, isLoading }: MovieSliderProps) => {
  const [, setTrailer] = useTrailer();
  const [, setOpen] = useMovieTrailerModal()

  const handleTrailer = (trailer: string) => {
    setTrailer(trailer);
    setOpen(true);
  }
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    initialSlide: 0,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  if (isLoading) {
    return (
      <div className="slider-container max-w-7xl mx-auto multiple-items-slider py-3">
        <Slider {...settings}>
          <div>
            <Skeleton className="h-[325px]  w-[290px]  rounded-xl" />
            <div className="space-y-2 mt-2">
              <Skeleton className="h-4 w-[290px]" />
              <Skeleton className="h-5 w-[290px]" />
              <Skeleton className="h-5 w-[290px]" />
            </div>
          </div>
          <div>
            <Skeleton className="h-[325px]  w-[290px]  rounded-xl" />
            <div className="space-y-2 mt-2">
              <Skeleton className="h-4 w-[290px]" />
              <Skeleton className="h-5 w-[290px]" />
              <Skeleton className="h-5 w-[290px]" />
            </div>
          </div>
          <div>
            <Skeleton className="h-[325px]  w-[290px]  rounded-xl" />
            <div className="space-y-2 mt-2">
              <Skeleton className="h-4 w-[290px]" />
              <Skeleton className="h-5 w-[290px]" />
              <Skeleton className="h-5 w-[290px]" />
            </div>
          </div>
          <div>
            <Skeleton className="h-[325px]  w-[290px]  rounded-xl" />
            <div className="space-y-2 mt-2">
              <Skeleton className="h-4 w-[290px]" />
              <Skeleton className="h-5 w-[290px]" />
              <Skeleton className="h-5 w-[290px]" />
            </div>
          </div>
        </Slider>
      </div>
    );
  }

  return (
    <div className="slider-container max-w-7xl mx-auto multiple-items-slider">
      <Slider {...settings}>
        {movies?.map((movie) => (
          <Link href={`/movie/${movie._id}`} key={movie._id}>
            <Card className="h-[560px] overflow-hidden group cursor-pointer">
              <CardContent className="flex relative   h-[370px]  p-6 ">
                <Image
                  src={movie.posterUrl || ""}
                  alt=""
                  fill
                  className="object-cover rounded-t-md"
                ></Image>
                <div className="absolute inset-0  bg-gray-900/70 z-10 opacity-0 group-hover:opacity-100  transition-transform duration-500 transform ">
                  <div className="flex flex-col items-center mt-5">
                    <h1 className="text-white mt-5 truncate">{movie.title}</h1>
                    <div>
                      <Button
                        variant="transparent"
                        size="icon"
                        className="gap-x-2  w-full hover:bg-transparent flex justify-start flex-wrap"
                      >
                        <Tag className="size-5 text-yellow-500" />
                       {movie.genre.map((g, i) => <span key={i} className="text-xs truncate">{g}</span>)}
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
                  </div>
                </div>
              </CardContent>
              <div className="bg-gradient-to-b flex flex-col  from-[#0F172A] to-[#121289]  h-full  overflow-hidden w-full p-3">
                <h1 className="text-white truncate p-3">{movie.title}</h1>

                <div className="flex flex-col justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleTrailer(movie.trailerUrl as string)}
                    className="gap-x-2  w-full bg-indigo-500 shadow-lg shadow-indigo-500/50 hover:bg-indigo-500/70 text-white hover:text-white "
                  >
                    <CirclePlay className="size-5" />
                    <span className="hover:underline ">Watch Trailer</span>
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="mt-2 gap-x-2 w-full bg-cyan-500 shadow-lg shadow-cyan-500/50 hover:bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-1000 ease-in-out"
                  >
                    <span className="">Buy ticket</span>
                  </Button>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </Slider>
    </div>
  );
};

export default MovieSlider;
