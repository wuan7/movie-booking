import * as React from "react";
import { CirclePlay, Clock, Earth, Languages, Tag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import { Button } from "../ui/button";

export const MovieCarousel = () => {
  const slice = [1, 2, 3, 4, 5, 6, 7];
  return (
    <Carousel
      opts={{
        align: "start",
      }}
      className="w-full max-w-6xl h-[560px] "
    >
      <CarouselContent className="">
        {slice.map((_s, index) => (
          <CarouselItem key={index} className="basis-1/4 group">
            <Card className="h-[560px] overflow-hidden ">
              <CardContent className="flex relative aspect-square  w-full h-[370px]  p-6 ">
                <Image
                  src={"/transformers-mot.webp"}
                  alt=""
                  fill
                  className="object-cover rounded-t-md"
                ></Image>
                <div className="absolute inset-0  bg-gray-900/70 z-10 opacity-0 group-hover:opacity-100  transition-transform duration-500 transform  group-hover:skew-y-3">
                  <div className="flex flex-col items-center mt-5">
                    <h1 className="text-white mt-5 truncate">THE EXECUTIONER</h1>
                    <div>
                      <Button
                        variant="transparent"
                        size="icon"
                        className="gap-x-2  w-full hover:bg-transparent flex justify-start"
                      >
                        <Tag className="size-5 text-yellow-500" />
                        <span className="text-xs truncate">Love</span>
                      </Button>
                      <Button
                        variant="transparent"
                        size="icon"
                        className="gap-x-2  w-full hover:bg-transparent flex justify-start"
                      >
                        <Clock className="size-5 text-yellow-500" />
                        <span className="text-xs">122</span>
                      </Button>
                      <Button
                        variant="transparent"
                        size="icon"
                        className="gap-x-2  w-full hover:bg-transparent flex justify-start"
                      >
                        <Earth className="size-5 text-yellow-500" />
                        <span className="text-xs">VIET NAM</span>
                      </Button>
                      <Button
                        variant="transparent"
                        size="icon"
                        className="gap-x-2  w-full hover:bg-transparent flex justify-start"
                      >
                        <Languages className="size-5 text-yellow-500" />
                        <span className="text-xs">VN</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
              <div className="bg-gradient-to-b flex flex-col  from-[#0F172A] to-[#121289]  h-full  overflow-hidden w-full p-3">
                <h1 className="text-white truncate p-3">
                  THE EXECUTIONER THE EXECUTIONER THE EXECUTIONER
                </h1>

                <div className="flex flex-col justify-between">
                  <Button
                    variant="outline"
                    size="sm"
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
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};
