import * as React from "react";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";

export const HomeCarousel = () => {
  return (
    <Carousel className="w-full max-w-6xl  mx-auto h-[370px] ">
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card>
                <CardContent className="flex relative  aspect-square h-[370px] w-full items-center justify-center p-6">
                  <Image src={'/transformers-mot.webp'} alt=""
                    fill
                    className="object-cover rounded-md"
                  >

                  </Image>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};
