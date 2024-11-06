"use client";
import React from "react";
import Slider from "react-slick";
import Image from "next/image";
import { useGetBanners } from "@/features/banners/api/use-get-banners";
import Link from "next/link";
const HomeSlider = () => {
  const { data } = useGetBanners();
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <Slider {...settings}>
      {data &&
        data.map((banner, index) => (
          <Link key={index} href={banner.link ? `/movie/${banner.link}` : "#"}>
            <div className="relative h-[200px] md:h-[400px] w-full ">
              <Image
                src={banner.posterUrl || ""}
                alt=""
                fill
                className="object-contain rounded-md"
              ></Image>
            </div>
          </Link>
        ))}
    </Slider>
  );
};
export default HomeSlider;
